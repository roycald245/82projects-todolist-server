import { Router } from 'express';
import todo from './routes/todo';

export default (service) => {
  const app = Router();
  todo(app, service);
  return app;
};
