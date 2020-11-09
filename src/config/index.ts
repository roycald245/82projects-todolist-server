import * as dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envExists = dotenv.config();
if (envExists.error) throw new Error('Missing .env file.');

export default {

  port: parseInt(process.env.PORT, 10),

  mongoUrl: process.env.MONGODB_URL,

  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
