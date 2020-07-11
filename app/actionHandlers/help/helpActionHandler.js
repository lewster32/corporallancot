'use strict';

const ActionHandlerBase = require("@actionHandlers/actionHandlerBase");

module.exports = class HelpActionHandler extends ActionHandlerBase {
  constructor({ logger, helpActionActions }) {
    super(logger, "help");
    this.actions = helpActionActions;
    this.help = "`!help` to show this message.";
  }

  async handle(action) {
    if (!action) {
      return;
    }
    let helpText = this.actions.map((action) => action.help).join("\r\n");
    return helpText;
  }
};
