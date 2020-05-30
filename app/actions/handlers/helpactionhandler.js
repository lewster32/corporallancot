const ActionHandler = require("../actionhandler");

module.exports = class HelpActionHandler extends ActionHandler {
  help = "`!help` to show this message.";

  constructor(bot) {
    super(bot, "help");
  }

  handle(action, msg) {
    return new Promise((resolve) => {
      let helpText = this.bot.actions.map((action) => action.help).join("\r\n");
      resolve(helpText);
    });
  }
};
