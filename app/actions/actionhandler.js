module.exports = class ActionHandler {
  bot = null;
  command = "";

  constructor(bot, command) {
    this.bot = bot;
    this.command = command;
    console.log("Initialised '!" + command + "' handler");
  }

  isMatch(action) {
    return (this.command && this.command === action.command);
  }

  async handle(action, msg) {
    return "";
  }
};
