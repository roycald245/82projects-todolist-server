import express from 'express';
import expressLoader from './express';
import Logger from './Logger';
import mongoLoader from './mongoose';

export default async ({ app }: { app: express.Application }) => {
  await mongoLoader().catch((err) => Logger.error(err.message));
  Logger.info('MongoDB loaded');

  await expressLoader({ app });
  Logger.info('Express Loaded');

  Logger.info('All loaders finished');
};
