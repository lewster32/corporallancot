'use strict';

const ActionHandlerBase = require("@actionHandlers/actionHandlerBase");

module.exports = class GenericActionHandler extends ActionHandlerBase {
  constructor({ logger }) {
    super(logger);
  }

  async handle(actionHandlerMessage) {
    if (!actionHandlerMessage) {
      return;
    }

    // TODO: This action handler is called whenever a bang command is not found for a message received by any server.
    // Do we need to log here?
    this.logger.log(`${this.logPrefix}Generic action handler received message`);
  }
};
