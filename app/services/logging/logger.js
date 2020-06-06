"use strict";

const path = require("path");

class LoggerTransports {
  static CONSOLE = "console";
  static FILE = "file";
}

module.exports = class Logger {
  constructor({ winston, loggerConfig }) {
    this.winston = winston;
    this.loggerConfig = loggerConfig;
  }

  init() {
    const transports = [];

    if (this.hasTransport(LoggerTransports.CONSOLE)) {
      transports.push(
        new this.winston.transports.Console({
          format: this.getLogFormat()
        })
      );
    }

    if (
      this.hasTransport(LoggerTransports.FILE) &&
      this.loggerConfig.path &&
      this.loggerConfig.fileName
    ) {
      transports.push(
        new this.winston.transports.File({
          filename: path.join(this.loggerConfig.path,this.loggerConfig.fileName),
          format: this.getLogFormat()
        })
      );
    }

    if (transports.length) {
      this.logger = this.winston.createLogger({
        level: this.loggerConfig.level,
        transports,
      });
    }

    return this;
  }

  exec(level, message, optionalParams) {
    if (!level) {
      level = "info";
    }

    // Fall back to default console implementation if
    // no transports are specified.
    if (!this.logger) {
      if (optionalParams && optionalParams.length) {
        console[level](message, optionalParams);
      } else {
        console[level](message);
      }
      return;
    }

    if (optionalParams && optionalParams.length > 0) {
      this.logger.log({
        level,
        message,
        meta: optionalParams,
      });
    } else {
      this.logger.log({ level, message });
    }
  }

  log(message, ...optionalParams) {
    this.exec("info", message, optionalParams);
  }

  debug(message, ...optionalParams) {
    this.exec("debug", message, optionalParams);
  }

  info(message, ...optionalParams) {
    this.exec("info", message, optionalParams);
  }

  warn(message, ...optionalParams) {
    this.exec("warn", message, optionalParams);
  }

  error(message, ...optionalParams) {
    this.exec("error", message, optionalParams);
  }

  getLogFormat() {
    return this.winston.format.combine(
      this.winston.format.timestamp({
        format: this.loggerConfig.timestampFormat,
      }),
      this.winston.format.printf(
        (info) => `${info.timestamp} [${info.level}] ${info.message}`
      )
    );
  }

  hasTransport(transport) {
    if (!this.loggerConfig.transports || !this.loggerConfig.transports.length) {
      return false;
    }
    return this.loggerConfig.transports.indexOf(transport) > -1;
  }
};
