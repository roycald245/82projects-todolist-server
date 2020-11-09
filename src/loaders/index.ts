import express from 'express';
import expressLoader from './express';
import Logger from './Logger';

export default async ({ app }: { app: express.Application }) => {
  await expressLoader({ app });
  Logger.info('Express Loaded');
};
