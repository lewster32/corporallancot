'use strict';

const ActionHandlerBase = require("@actionHandlers/actionHandlerBase");

module.exports = class HelpActionHandler extends ActionHandlerBase {
  constructor({ logger, helpActionActions }) {
    super(logger, "help");
    this.actions = helpActionActions;
    this.help = "`!help` to show this message.";
  }

  async handle(actionHandlerMessage) {
    if (!actionHandlerMessage) {
      return;
    }
    let helpText = this.actions.map(a => a.help).join("\r\n");
    return helpText;
  }
};
