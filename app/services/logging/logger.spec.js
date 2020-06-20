"use strict";

const fs = require("fs");
const Logger = require("./logger");
const LoggerConfig = require("./loggerConfig");
const Winston = require("winston");
require("winston-daily-rotate-file");

describe("logger", () => {
  it("does not create a Winston instance if transports is undefined", function () {
    const loggerConfig = new LoggerConfig({ appConfig: {} });
    delete loggerConfig.transports;
    const logger = new Logger({ winston: Winston, loggerConfig }).init();
    expect(logger.logger).toBeUndefined();
  });

  it("does not create a Winston instance if transports array is empty", function () {
    const loggerConfig = new LoggerConfig({ appConfig: {} });
    loggerConfig.transports = [];
    const logger = new Logger({ winston: Winston, loggerConfig }).init();
    expect(logger.logger).toBeUndefined();
  });

  it("does not create a Winston instance if invalid transports are specified", function () {
    const loggerConfig = new LoggerConfig({ appConfig: {} });
    loggerConfig.transports = ["invalid"];
    const logger = new Logger({ winston: Winston, loggerConfig }).init();
    expect(logger.logger).toBeUndefined();
  });

  it("does not create a Winston instance if transports is an empty string", function () {
    const loggerConfig = new LoggerConfig({ appConfig: {} });
    loggerConfig.transports = "";
    const logger = new Logger({ winston: Winston, loggerConfig }).init();
    expect(logger.logger).toBeUndefined();
  });

  it("creates a Winston instance if invalid transports are specified alongside valid ones", function () {
    const loggerConfig = new LoggerConfig({ appConfig: {} });
    loggerConfig.transports = ["invalid", "console"];
    const logger = new Logger({ winston: Winston, loggerConfig }).init();
    expect(logger.logger).toBeDefined();
  });

  it("creates a Winston instance if transports is a string", function () {
    const loggerConfig = new LoggerConfig({ appConfig: {} });
    loggerConfig.transports = "console";
    const logger = new Logger({ winston: Winston, loggerConfig }).init();
    expect(logger.logger).toBeDefined();
  });

  it("does not add a file transport if a rolling transport is specified", function () {
    const loggerConfig = new LoggerConfig({ appConfig: {} });
    loggerConfig.transports = ["file", "rolling"];
    const logger = new Logger({ winston: Winston, loggerConfig }).init();

    expect(logger.logger.transports.length).toEqual(1);
    expect(logger.logger.transports[0]).toEqual(
      jasmine.any(Winston.transports.DailyRotateFile)
    );
  });
});
