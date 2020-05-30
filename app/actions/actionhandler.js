module.exports = class ActionHandler {
  constructor(bot, command) {
    this.bot = bot;
    this.command = command;
    console.log("Initialised '!" + command + "' handler...");
  }

  isMatch(action) {
    return this.command && action.command === this.command;
  }

  async handle(action, msg) {
    return "";
  }
};
