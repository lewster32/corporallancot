const NotImplemented = require("@errors/notImplemented");

module.exports = class ActionHandler {
  constructor(logger, command) {
    this.command = command;
    this.logger = logger;
    this.logger.log(`Initialising '!${command}' action handler`);
  }

  isMatch(action) {
    return (this.command && this.command === action.command);
  }

  async handle(action, msg) {
    throw NotImplemented;
  }
};
