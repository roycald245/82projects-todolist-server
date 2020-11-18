import TodoService from '../services/todoService';
import TodoModel from '../models/todo';
import postgresLoader from './postgreSql';

export default async () => new TodoService(TodoModel, await postgresLoader());
