import express from 'express';
import expressLoader from './express';
import Logger from './Logger';
import mongoLoader from './mongoose';

export default async ({ app }: { app: express.Application }) => {
  const mongoConnection = await mongoLoader();
  Logger.info('MongoDB loaded');

  await expressLoader({ app });
  Logger.info('Express Loaded');
};
