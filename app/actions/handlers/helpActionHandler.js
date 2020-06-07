'use strict';

const ActionHandler = require("@actions/actionHandler");

module.exports = class HelpActionHandler extends ActionHandler {
  help = "`!help` to show this message.";

  constructor({ logger, helpActionActions }) {
    super(logger, "help");
    this.actions = helpActionActions;
  }

  async handle(action, msg) {
    if (!action) {
      return;
    }
    let helpText = this.actions.map((action) => action.help).join("\r\n");
    return helpText;
  }
};
