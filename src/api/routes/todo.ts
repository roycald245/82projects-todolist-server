import {
  Router, Request, Response, NextFunction,
} from 'express';
import { celebrate, Joi, errors } from 'celebrate';
import TodoService from '../../services/todoService';
import TodoModel from '../../models/todo';

const todoService = new TodoService(TodoModel);
const route = Router();
export default (app: Router) => {
  app.use('/todo', route);
  route.post(
    '/',
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string(),
      }),
    }),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        todoService.addTodo({ name: req.body.name, description: req.body.description || '' }).then(
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
        todoService.removeTodo(req.body.id).then(() => res.status(200).send());
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
        isComplete: Joi.boolean(),
      }),
    }), (req: Request, res: Response, next: NextFunction) => {
      try {
        todoService.updateTodo({
          id: req.body.id, name: req.body.name, description: req.body.description || '', isComplete: req.body.isComplete,
        })
          .then(() => res.status(200).send());
      } catch (e) {
        return next(e);
      }
    });

  route.use(errors());
};
