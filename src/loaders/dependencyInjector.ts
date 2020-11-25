import { Container } from 'typedi';
import LoggerInstance from './Logger';

export default async ({ models, pgAdapter }: {
  models: { name: string, model: any }[],
  pgAdapter: any
}) => {
  try {
    models.forEach((model) => {
      Container.set(model.name, model.model);
    });

    Container.set('logger', LoggerInstance);
    Container.set('postgresAdapter', await pgAdapter);
  } catch (error) {
    LoggerInstance.error('Error on dependency injector loader: %o', error);
    throw error;
  }
};
