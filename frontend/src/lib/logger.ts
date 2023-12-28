import winston, { LoggerOptions } from "winston";

export const loggerOptions: LoggerOptions = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json({
      space: 2,
      replacer(_key, value) {
        if (value === undefined) {
          return "undefined";
        }
        if (value === null) {
          return "null";
        }
        if (value === "") {
          return "";
        }
        return value;
      },
    })
  ),
  transports: [new winston.transports.Console({})],
  level: process.env.LOG_LEVEL || "info",
};

const logger = winston.createLogger({
  ...loggerOptions,
});

export default logger;
