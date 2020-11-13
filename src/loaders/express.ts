import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from '../api';

export default ({ app }: { app: express.Application }) => {
  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });

  app.use(cors());
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(express.json());
  app.use(express.static('./public'));

  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(routes());

  return app;
};
