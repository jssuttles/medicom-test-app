const winston = require('winston');
require('winston-daily-rotate-file');

const myFormat = winston.format.printf(info => `${info.timestamp} ${info.level}: ${(info.url && info.method) ? `${info.method} ${info.url} ${info.status} - ` : ''}${info.stack}`);

const format = winston.format.combine(winston.format.timestamp(), myFormat);

module.exports = winston.createLogger({
  format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      level: 'info',
    }),
  ],
});
