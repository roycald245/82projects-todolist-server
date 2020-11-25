import {
  Router, Request, Response, NextFunction,
} from 'express';
import { celebrate, Joi, errors } from 'celebrate';
import { Logger } from 'winston';
import { Container } from 'typedi';
import TodoService from '../../services/todoService';

const route = Router();
export default (app: Router) => {
  app.use('/todo', route);

  route.get(
    '/',
    (req: Request, res: Response, next: NextFunction) => {
      const logger:Logger = Container.get('logger');
      try {
        const todoService = Container.get<TodoService>(TodoService);
        todoService.getTodos().then(
          (response) => {
            res.status(200).send(response);
          },
        ).catch((e) => next(e));
      } catch (e) {
        logger.error('Error: %o', e);
        next(e);
      }
    },
  );

  route.post(
    '/',
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string(),
      }),
    }),
    (req: Request, res: Response, next: NextFunction) => {
      const logger:Logger = Container.get('logger');
      try {
        const todoService = Container.get(TodoService);
        todoService.addTodo({ name: req.body.name, description: req.body.description || '' }).then(
          (response) => {
            res.status(200).send(response);
          },
        ).catch((e) => next(e));
      } catch (e) {
        logger.error('Error: %o', e);
        next(e);
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
      const logger:Logger = Container.get('logger');
      try {
        const todoService = Container.get(TodoService);
        todoService.removeTodo(req.body.id).then(() => res.status(200).send());
      } catch (e) {
        logger.error('Error: %o', e);
        return next(e);
      }
    });

  route.put('/',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        id: Joi.string().required(),
        description: Joi.string().allow(''),
        isComplete: Joi.boolean(),
      }),
    }), (req: Request, res: Response, next: NextFunction) => {
      const logger:Logger = Container.get('logger');
      try {
        const todoService = Container.get(TodoService);
        todoService.updateTodo({
          id: req.body.id, name: req.body.name, description: req.body.description || '', isComplete: req.body.isComplete,
        })
          .then(() => res.status(200).send());
      } catch (e) {
        logger.error('Error %o', e);
        return next(e);
      }
    });

  route.use(errors());
};
