import { Pool, Client } from 'pg';
import Logger from '../loaders/Logger';

export default class PostgresAdapter {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async getById(id: string) {
    this.pool
      .connect()
      .then((client: Client) => client
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

  public async getAll() {
    this.pool
      .connect()
      .then((client: Client) => client
        .query('SELECT * FROM todos')
        .then((res) => {
          client.release();
          Logger.info(`Queried ${res.rows}`);
          return res;
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
      .then((client: Client) => client
        .query('DELETE FROM todos WHERE id = $1', [id])
        .then((res) => {
          client.release();
          Logger.info(`Deleted ${id} successfully`);
        }).catch((error: Error) => {
          client.release();
          Logger.error(error);
          throw error;
        }));
  }

  public async updateById(id: string, name: string, description: string, isComplete: boolean) {
    this.pool
      .connect()
      .then((client: Client) => client
        .query('UPDATE todos SET name=$1, description=$2, isComplete=$3 WHERE id=$4', [name, description, isComplete, id])
        .then((res) => {
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
      .then((client: Client) => client
        .query('INSERT INTO todos(id,name,description,isComplete) VALUES ($1, $2, $3, $4)', [id, name, description, isComplete])
        .then((res) => {
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
