'use strict';

const ActionHandlerMessage = require("@actionHandlers/actionHandlerMessage");

module.exports = class ActionHandlerResolver {
  async resolve(actionHandlerMessage) {
    throw Error("Implement the ActionHandlerResolver!");
  }
}
