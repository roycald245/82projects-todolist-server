import { v4 as uuidv4 } from 'uuid';
import { Service, Inject } from 'typedi';
import { Logger } from 'winston';
import TodoModel from '../models/todo';
import PostgresAdapter from '../DAL/postgresAdapter';

@Service()
export default class TodoService {
  @Inject('todoModel')
  Todo!: typeof TodoModel;

  @Inject('postgresAdapter')
  pgAdapter!: PostgresAdapter;

  @Inject('logger')
  logger!: Logger;

  public async getTodos()
    : Promise<Object[]> {
    this.logger.info('Getting todos');
    let postgresRes: Object[] = [];
    try {
      postgresRes = await this.pgAdapter.getAll();
      if (postgresRes.length !== 0) {
        this.logger.info('Got todos from PostgreSQL');
        return postgresRes;
      }
      this.logger.info('Getting todos from mongoDB');
      return await this.Todo.find({});
    } catch (e) {
      this.logger.error(e);
    }
    return postgresRes;
  }

  public async addTodo({ name, description }: { name: string; description: string; })
    : Promise<{ name: string, id: string }> {
    this.logger.info(`Inserting Todo to postgres ${name}`);
    let postgesStatus = true;
    // Generate shared uuid for both databases
    const id = uuidv4();
    // Add to postgres
    try {
      await this.pgAdapter.add(id, name, description, false);
    } catch (e) {
      this.logger.error(`Failed to insert to postgres: ${e}`);
      postgesStatus = false;
    }
    // Add to mongoDB
    const newTodo = new this.Todo({
      _id: id, name, description, isComplete: false,
    });
    return newTodo.save().then((todo: any) => {
      this.logger.info(`Todo ${name} was successfully added to mongo with id ${todo.id}`);
      return { name: todo.name, id: todo.id };
    }).catch((error: Error) => {
      this.logger.error(error);
      // if both databases fail throw error
      if (!postgesStatus) throw new Error('Failed to add to mongo and to postgres');
      return { name: '', id: '' };
    });
  }

  public async removeTodo(id: string) {
    let postgresStatus = true;
    this.logger.info(`Removing Todo with id:${id} from postgres`);
    try {
      await this.pgAdapter.removeById(id);
      this.logger.info(`Removed Todo with id:${id} successfuly from postgres`);
    } catch (e) {
      this.logger.error(e);
      postgresStatus = false;
    }
    this.Todo.findOneAndDelete({ _id: id }).then(() => this.logger.info(`Removed Todo with id:${id} successfuly from mongo`))
      .catch((error: Error) => {
        this.logger.error(error);
        if (!postgresStatus) throw new Error('Failed to delete in both databases');
      });
  }

  public async updateTodo({
    id, name, description, isComplete,
  }
    : { id: string, name: string, description: string, isComplete: boolean }) {
    this.logger.info(`Updating Todo ${id} in postgres`);
    let postgresStatus = true;

    try {
      await this.pgAdapter.updateById(id, name, description, isComplete);
    } catch (e) {
      this.logger.error(e);
      postgresStatus = false;
    }

    this.Todo.findByIdAndUpdate(id, { name, description, isComplete }).then(() => this.logger.info(`Updated ${id} Successfully in mongo`))
      .catch((error: Error) => {
        this.logger.error(error);
        if (!postgresStatus) throw new Error('Failed to update in both databases');
      });
  }
}
