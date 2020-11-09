import express from 'express';
import loaders from './loaders';
import config from './config';
import Logger from './loaders/Logger';

async function startServer() {
  const app = express();

  await loaders({ app });
  app.listen(config.port, () => {
    Logger.info(`Server listening on port:${config.port}`);
  }).on('error', (err) => {
    Logger.error(err.message);
    process.exit(1);
  });
}

startServer();
