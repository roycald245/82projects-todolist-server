import {
  Router, Request, Response, NextFunction,
} from 'express';

const route = Router();

export default (app: Router) => {
  app.use('/search', route);

  route.get(
    '/',
    (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(200).json({ req });
      } catch (e) {
        return next(e);
      }
    },
  );

  route.get(
    '/search/id/:id',
  );
};
