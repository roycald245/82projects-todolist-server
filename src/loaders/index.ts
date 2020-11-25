import express from 'express';
import expressLoader from './express';
import Logger from './Logger';
import mongoLoader from './mongoose';
import todoModel from '../models/todo';
import dependencyInjector from './dependencyInjector';
import postgreSql from './postgreSql';

export default async ({ app }: { app: express.Application }) => {
  const pgAdapter = await postgreSql().then((res) => {
    Logger.info('PostgreSQL loaded');
    return res;
  }).catch((err) => Logger.error(`Failed to connect to PostgreSQL: ${err}`));

  await mongoLoader().then(() => Logger.info('MongoDB loaded')).catch((err) => Logger.error(`Failed to connect to mongo: ${err}`));

  const todo = {
    name: 'todoModel',
    model: todoModel,
  };

  await dependencyInjector({ pgAdapter, models: [todo] });

  await expressLoader({ app });
  Logger.info('Express Loaded');
};
