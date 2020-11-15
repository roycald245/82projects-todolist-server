import { v4 as uuidv4 } from 'uuid';
import TodoModel from '../models/todo';
import Logger from '../loaders/Logger';
import PostgresAdapter from '../DAL/postgresAdapter';
import postgreLoader from '../loaders/postgreSql';

export const addTodo = async ({ name, description }: { name: string; description: string; })
  : Promise<{ name: string, id: string }> => {
  Logger.info(`Adding Todo ${name}`);
  const id = uuidv4();
  PostgresAdapter.add(id,)
  const newTodo = new TodoModel({ id, name, description, isComplete: false });
  return newTodo.save().then((todo: any) => {
    Logger.info(`Todo ${name} was successfully added with id ${todo.id}`);
    return { name: todo.name, id: todo.id };
  }).catch((error: Error) => {
    Logger.error(error);
    return { error };
  });
};

export const removeTodo = async (id: string) => {
  Logger.info(`Removing Todo with id:${id}`);
  TodoModel.findOneAndDelete({ _id: id }).then((error: Error) => {
    if (error) return Logger.error(error);
    return Logger.info(`Removed Todo with id:${id} successfuly`);
  });
};

export const updateTodo = async ({
  id, name, description, isComplete,
}
  : { id: string, name: string, description: string, isComplete: boolean }) => {
  Logger.info(`Updating Todo ${id}`);
  TodoModel.findByIdAndUpdate(id, { name, description, isComplete }).then((error: Error) => {
    if (error) return Logger.error(error);
    return Logger.info(`Updated ${id} Successfully`);
  });
};
