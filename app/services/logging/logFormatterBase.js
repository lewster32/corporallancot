"use strict";

const NotImplemented = require("@errors/notImplemented");

module.exports = class LogFormatterBase {
  constructor({ winston, loggerConfig }) {
    this.winston = winston;
    this.loggerConfig = loggerConfig;
  }

  getFormat() {
    throw NotImplemented;
  }
};
