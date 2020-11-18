import { v4 as uuidv4 } from 'uuid';
import { Model, Types } from 'mongoose';
import Logger from '../loaders/Logger';
import PostgresAdapter from '../DAL/postgresAdapter';

export default class TodoService {
  private pgAdapter: PostgresAdapter;

  private TodoModel: Model;

  constructor(model: Model, pgAdapter: PostgresAdapter) {
    this.TodoModel = model;
    this.pgAdapter = pgAdapter;
  }

  public async getTodos()
    : Promise<Object[]> {
    Logger.info('Getting todos');
    let postgresRes: Object[] = [];
    try {
      postgresRes = await this.pgAdapter.getAll();
      if (postgresRes.length !== 0) {
        Logger.info('Got todos from PostgreSQL');
        return postgresRes;
      }
      Logger.info('Getting todos from mongoDB');
      return await this.TodoModel.find({});
    } catch (e) {
      Logger.error(e);
    }
    return postgresRes;
  }

  public async addTodo({ name, description }: { name: string; description: string; })
    : Promise<{ name: string, id: string }> {
    Logger.info(`Inserting Todo to postgres ${name}`);
    let postgesStatus = true;
    // Generate shared uuid for both databases
    const id = uuidv4();
    // Add to postgres
    try {
      await this.pgAdapter.add(id, name, description, false);
    } catch (e) {
      Logger.error(`Failed to insert to postgres: ${e}`);
      postgesStatus = false;
    }
    // Add to mongoDB
    const newTodo = new this.TodoModel({
      _id: id, name, description, isComplete: false,
    });
    return newTodo.save().then((todo: any) => {
      Logger.info(`Todo ${name} was successfully added to mongo with id ${todo.id}`);
      return { name: todo.name, id: todo.id };
    }).catch((error: Error) => {
      Logger.error(error);
      // if both databases fail throw error
      if (!postgesStatus) throw new Error('Failed to add to mongo and to postgres');
    });
  }

  public async removeTodo(id: string) {
    let postgresStatus = true;
    Logger.info(`Removing Todo with id:${id} from postgres`);
    try {
      await this.pgAdapter.removeById(id);
      Logger.info(`Removed Todo with id:${id} successfuly from postgres`);
    } catch (e) {
      Logger.error(e);
      postgresStatus = false;
    }
    this.TodoModel.findOneAndDelete({ _id: id }).then(() => Logger.info(`Removed Todo with id:${id} successfuly from mongo`))
      .catch((error: Error) => {
        Logger.error(error);
        if (!postgresStatus) throw new Error('Failed to delete in both databases');
      });
  }

  public async updateTodo({
    id, name, description, isComplete,
  }
    : { id: string, name: string, description: string, isComplete: boolean }) {
    Logger.info(`Updating Todo ${id} in postgres`);
    let postgresStatus = true;

    try {
      await this.pgAdapter.updateById(id, name, description, isComplete);
    } catch (e) {
      Logger.error(e);
      postgresStatus = false;
    }

    this.TodoModel.findByIdAndUpdate(id, { name, description, isComplete }).then(() => Logger.info(`Updated ${id} Successfully in mongo`))
      .catch((error: Error) => {
        Logger.error(error);
        if (!postgresStatus) throw new Error('Failed to update in both databases');
      });
  }
}
