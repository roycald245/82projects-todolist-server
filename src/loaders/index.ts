import express from 'express';
import expressLoader from './express';
import Logger from './Logger';
import mongoLoader from './mongoose';
import todoService from './todoService';

export default async ({ app }: { app: express.Application }) => {
  await mongoLoader().then(() => Logger.info('MongoDB loaded')).catch((err) => Logger.error(`Failed to connect to mongo: ${err}`));

  const service = await todoService();

  await expressLoader({ app, service });
  Logger.info('Express Loaded');
};
