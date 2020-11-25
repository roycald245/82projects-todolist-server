import { Pool, PoolClient } from 'pg';
import Logger from '../loaders/Logger';

export default class PostgresAdapter {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async getById(id: string) {
    return this.pool
      .connect()
      .then((client: PoolClient) => client
        .query('SELECT * FROM todos WHERE id = $1', [id])
        .then((res) => {
          client.release();
          Logger.info(`Queried ${res.rows[0]}`);
          return res;
        })
        .catch((err: Error) => {
          client.release();
          Logger.error(err.stack);
          throw err;
        }));
  }

  public async getAll(): Promise<Array<Object>> {
    return this.pool
      .connect()
      .then((client: PoolClient) => client
        .query('SELECT * FROM todos order by "isComplete" asc')
        .then((res) => {
          client.release();
          Logger.info(`Queried ${res.rows.length} rows from PostgeSQL`);
          return res.rows;
        })
        .catch((error: Error) => {
          client.release();
          Logger.error(error.stack);
          throw error;
        }));
  }

  public async removeById(id: string) {
    this.pool
      .connect()
      .then((client: PoolClient) => client
        .query('DELETE FROM todos WHERE id = $1', [id])
        .then((res) => {
          client.release();
          Logger.info(`Deleted ${res.rowCount} rows`);
        }).catch((error: Error) => {
          client.release();
          Logger.error(error);
          throw error;
        }));
  }

  public async updateById(id: string, name: string, description: string, isComplete: boolean) {
    this.pool
      .connect()
      .then((client: PoolClient) => client
        .query('UPDATE todos SET name=$1, description=$2, "isComplete"=$3 WHERE id=$4', [name, description, isComplete, id])
        .then(() => {
          client.release();
          Logger.info(`Updated ${id} successfully`);
        })
        .catch((error: Error) => {
          client.release();
          Logger.error(error);
          throw error;
        }));
  }

  public async add(id: string, name: string, description: string, isComplete: boolean) {
    this.pool
      .connect()
      .then((client: PoolClient) => client
        .query('INSERT INTO todos(id,name,description,"isComplete") VALUES ($1, $2, $3, $4)', [id, name, description, isComplete])
        .then(() => {
          client.release();
          Logger.info(`Inserted ${id} successfully`);
        })
        .catch((error: Error) => {
          client.release();
          Logger.error(error);
          throw error;
        }));
  }
}
