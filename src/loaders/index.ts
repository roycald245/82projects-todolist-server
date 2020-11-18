import express from 'express';
import expressLoader from './express';
import Logger from './Logger';
import mongoLoader from './mongoose';

export default async ({ app }: { app: express.Application }) => {
  await mongoLoader().then(() => Logger.info('MongoDB loaded')).catch((err) => Logger.error(`Failed to connect to mongo: ${err}`));

  await expressLoader({ app });
  Logger.info('Express Loaded');
};
