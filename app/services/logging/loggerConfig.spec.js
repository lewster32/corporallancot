"use strict";

const LoggerConfig = require("./loggerConfig");

describe("loggerConfig", () => {
  it("creates a separate object for rolling file logging config", function () {
    const loggerConfig = new LoggerConfig({ appConfig: {} });
    expect(loggerConfig.rotate).toBeDefined();
  });
});
