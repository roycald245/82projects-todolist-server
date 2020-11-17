import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import Logger from '../loaders/Logger';
import PostgresAdapter from '../DAL/postgresAdapter';
import postgresLoader from '../loaders/postgreSql';

export default class TodoService {
  private PostgresAdapter: PostgresAdapter;

  private TodoModel: Model;

  constructor(model: Model) {
    this.TodoModel = model;
  }

  public async init() {
    this.PostgresAdapter = await postgresLoader();
  }

  public async addTodo({ name, description }: { name: string; description: string; })
    : Promise<{ name: string, id: string }> {
    Logger.info(`Adding Todo ${name}`);
    let postgesStatus = true;
    // Generate shared uuid for both databases
    const id = uuidv4();
    // Add to postgres
    try {
      await this.PostgresAdapter.add(id, name, description, false);
    } catch (e) {
      Logger.error(`Failed to add to postgres: ${e}`);
      postgesStatus = false;
    }
    // Add to mongoDB
    const newTodo = new this.TodoModel({
      id, name, description, isComplete: false,
    });
    return newTodo.save().then((todo: any) => {
      Logger.info(`Todo ${name} was successfully added with id ${todo.id}`);
      return { name: todo.name, id: todo.id };
    }).catch((error: Error) => {
      Logger.error(error);
      // if both databases fail throw error
      if (!postgesStatus) throw new Error('Failed to add to mongo and to postgres');
    });
  }

  public async removeTodo(id: string) {
    let postgresStatus = true;
    Logger.info(`Removing Todo with id:${id}`);
    try {
      await this.PostgresAdapter.removeById(id);
    } catch (e) {
      Logger.error(e);
      postgresStatus = false;
    }
    this.TodoModel.findOneAndDelete({ _id: id }).then(() => Logger.info(`Removed Todo with id:${id} successfuly`))
      .catch((error: Error) => {
        Logger.error(error);
        if (!postgresStatus) throw new Error('Failed to delete in both databases');
      });
  }

  public async updateTodo({
    id, name, description, isComplete,
  }
    : { id: string, name: string, description: string, isComplete: boolean }) {
    Logger.info(`Updating Todo ${id}`);
    let postgresStatus = true;

    try {
      await this.PostgresAdapter.updateById(id, name, description, isComplete)
    } catch (e) {
      Logger.error(e);
      postgresStatus = false;
    }

    this.TodoModel.findByIdAndUpdate(id, { name, description, isComplete }).then(() => Logger.info(`Updated ${id} Successfully`))
      .catch((error: Error) => {
        Logger.error(error);
        if (!postgresStatus) throw new Error('Failed to update in both databases');
      });
  }
}
