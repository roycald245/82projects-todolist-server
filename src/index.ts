import express from 'express';
import loaders from './loaders';
import config from './config';

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  app.listen(config.port, () => {

  }).on('error', (err) => {
    process.exit(1);
  });
}

startServer();
