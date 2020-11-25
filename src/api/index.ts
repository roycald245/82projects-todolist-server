import { Router } from 'express';
import todo from './routes/todo';

export default () => {
  const app = Router();
  todo(app);
  return app;
};
