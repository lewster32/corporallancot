"use strict";

module.exports = class LogFormatterBase {
  constructor({ winston, loggerConfig }) {
    this.winston = winston;
    this.loggerConfig = loggerConfig;
  }

  getFormat() {
    return this.winston.format.combine(
      this.winston.format.timestamp({
        format: this.loggerConfig.timestampFormat,
      }),
      this.winston.format.printf(
        (info) => `${info.timestamp} [${info.level}] ${info.message}`
      )
    );
  }
};
