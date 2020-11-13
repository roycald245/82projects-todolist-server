import TodoModel from "../models/todo";
import Logger from '../loaders/Logger';

export const addTodo = async ({ name, description }: { name: string; description: string; })
  : Promise<{ name: string, id: string }> => {
  Logger.info(`Adding Todo ${name}`);
  const newTodo = new TodoModel({ name, description });
  return newTodo.save().then((todo) => {
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
  }).catch((error: Error) => Logger.error(error));
};
