import { Pool } from 'pg';
import config from '../config';
import Logger from './Logger';
import PostgresAdapter from '../DAL/postgresAdapter';

export default async () => {
  let pool;
  try {
    pool = new Pool();
    await pool.connect();
  } catch (e) {
    Logger.error(e);
    throw new Error('Failed to connect to PostgreSQL');
  }

  pool.on('error', (error: Error) => {
    Logger.error(`Unexpected error on idle client: ${error}`);
  });

  return new PostgresAdapter(pool);
};
