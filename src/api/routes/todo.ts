import {
  Router, Request, Response, NextFunction,
} from 'express';
import { celebrate, Joi } from 'celebrate';
import { addTodo, removeTodo, updateTodo } from '../../services/todoService';

const route = Router();
export default (app: Router) => {
  app.use('/todo', route);

  route.post(
    '/',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        id: Joi.string().required(),
        description: Joi.string(),
      }),
    }),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        addTodo({ name: req.body.name, description: req.body.description || '' }).then(
          (response) => {
            res.status(200).send(response);
          },
        );
      } catch (e) {
        return next(e);
      }
    },
  );

  route.delete('/',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        removeTodo(req.body.id).then(() => res.status(200).send());
      } catch (e) {
        return next(e);
      }
    });

  route.put('/',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        id: Joi.string().required(),
        description: Joi.string(),
      }),
    }), (req: Request, res: Response, next: NextFunction) => {
      try {
        updateTodo({ id: req.body.id, name: req.body.name, description: req.body.description || '' })
          .then(() => res.status(200).send());
      } catch (e) {
        return next(e);
      }
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
