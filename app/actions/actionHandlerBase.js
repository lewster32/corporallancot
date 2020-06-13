'use strict';

const NotImplemented = require("@errors/notImplemented");

module.exports = class ActionHandlerBase {
  constructor(logger, command) {
    this.command = command;
    this.logger = logger;
    this.logPrefix = `[${this.constructor.name}] `;
    this.logger.log(`${this.logPrefix}Initialising '!${command}' action handler`);
  }

  isMatch(action) {
    return (this.command && this.command === action.command);
  }

  async handle(action, msg) {
    throw NotImplemented;
  }
};
