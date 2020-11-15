import { Pool } from 'pg';
import config from '../config';
import Logger from './Logger';

export default async () => {
  const pool = new Pool(config.pgConnectionString);

  pool.on('error', (error: Error) => {
    Logger.error(`Unexpected error on idle client: ${error}`);
  });

  return pool;
};
