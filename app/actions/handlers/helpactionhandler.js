const ActionHandler = require("@actions/actionhandler");

module.exports = class HelpActionHandler extends ActionHandler {
  help = "`!help` to show this message.";

  constructor({ logger, actions }) {
    super(logger, "help");
    // this.bot = bot;
  }

  async handle(action, msg) {
    let helpText = this.actions.map((action) => action.help).join("\r\n");
    return helpText;
  }
};
