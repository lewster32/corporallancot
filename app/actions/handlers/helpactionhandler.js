const ActionHandler = require("@actions/actionhandler");

module.exports = class HelpActionHandler extends ActionHandler {
  help = "`!help` to show this message.";

  constructor(bot) {
    super(bot, "help");
  }

  async handle(action, msg) {
    let helpText = this.bot.actions.map((action) => action.help).join("\r\n");
    return helpText;
  }
};
