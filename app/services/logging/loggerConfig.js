"use strict";

module.exports = class LoggerConfig {
  constructor({ appConfig }) {
    this.level = appConfig.logLevel || "info";
    this.transports = appConfig.logTransports || ["console"];
    this.path = appConfig.logPath || "./logs";
    this.fileName = appConfig.logFileName || "bot.log";
    this.timestampFormat = appConfig.logTimestampFormat || "";
  }
};
