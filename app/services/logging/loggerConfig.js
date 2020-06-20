"use strict";

module.exports = class LoggerConfig {
  constructor({ appConfig }) {
    this.level = appConfig.logLevel || "info";
    this.transports = appConfig.logTransports || ["console"];
    this.path = appConfig.logPath || "./logs";
    this.fileName = appConfig.logFileName || "bot.log";
    this.timestampFormat = appConfig.logTimestampFormat || "";

    this.rotate = {
      datePattern: appConfig.logDailyRotateDatePattern || "YYYY-MM-DD",
      frequency: appConfig.logDailyRotateFrequency || null,
      maxFiles: appConfig.logDailyRotateMaxFiles || "7d",
      maxSize: appConfig.logDailyRotateMaxSize || "10m",
      zipped: appConfig.logDailyRotateZipped || false,
    };
  }
};
