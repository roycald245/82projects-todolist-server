import * as express from 'express';
import loaders from './loaders';
import config from './config';
import Logger from './loaders/Logger';

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  app.listen(config.port, () => {
    Logger.info(`Server listening on port:${config.port}`);
  }).on('error', (err) => {
    process.exit(1);
  });
}

startServer();
