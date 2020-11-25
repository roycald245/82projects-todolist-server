import appRoot from 'app-root-path';
import * as winston from 'winston';
import config from '../config';

const transports = [];
if (process.env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console(),
  );
} else {
  transports.push(
    new winston.transports.File({ filename: `${appRoot}/logs/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${appRoot}/logs/combined.log`, level: config.logLevel || 'info' }),
  );
}

const LoggerInstance = winston.createLogger({
  level: config.logLevel || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

// LoggerInstance.stream = {
//   write(message: string) {
//     LoggerInstance.info(message);
//   },
// };

export default LoggerInstance;
