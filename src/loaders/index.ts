import expressLoader from './express';
import Logger from './Logger'

export default async ({ expressApp }) => {
  await expressLoader(expressApp);
  Logger.info('Express Loaded');
};
