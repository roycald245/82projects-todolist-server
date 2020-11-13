import {
  Router, Request, Response, NextFunction,
} from 'express';
import { addTodo, removeTodo } from '../../services/todoService';
import Logger from '../../loaders/Logger';

const route = Router();
export default (app: Router) => {
  app.use('/todo', route);

  route.post(
    '/',
    (req: Request, res: Response, next: NextFunction) => {
      try {
        addTodo({ name: req.body.name, description: req.body.description }).then(
          (response) => {
            res.status(200).send(response);
          },
        );
      } catch (e) {
        return next(e);
      }
    },
  );

  route.delete('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      removeTodo(req.body.id).then(() => res.status(200).send());
    } catch (e) {
      return next(e);
    }
  });

  route.put((req: Request, res: Response, next: NextFunction) => {

  });

  route.get('/:id', (req: Request, res: Response) => {
    res.send('hi');
    console.log('yahoo');
  });

  route.get('/', (req: Request, res: Response) => {
    res.send('hi');
    console.log('yahoo');
  });
};
