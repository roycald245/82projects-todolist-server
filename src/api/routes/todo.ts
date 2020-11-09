import {
  Router, Request, Response, NextFunction,
} from 'express';

const route = Router();

export default (app: Router) => {
  app.use('/todo', route);

  route.post(
    '/',
    (req: Request, res: Response, next:NextFunction) => {
      try {
        res.status(200).send(req.body);
      } catch (e) {
        return next(e);
      }
    },
  );

  route.put((req: Request, res: Response, next:NextFunction) => {

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
