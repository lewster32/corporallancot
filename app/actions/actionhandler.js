module.exports = class ActionHandler {
  constructor(logger, command) {
    this.command = command;
    this.logger = logger;
    this.logger.log(`Initialised '!${command}' handler`);
  }

  isMatch(action) {
    return (this.command && this.command === action.command);
  }

  async handle(action, msg) {
    throw new Error("Not implemented");
  }
};
