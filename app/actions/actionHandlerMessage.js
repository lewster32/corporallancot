'use strict';

// This class acts as an interface between the chatListeners and the actionHandlers
module.exports = class ActionHandlerMessage {
  constructor() {
    this.command = "";
    this.data = "";
    this.isBangCommand = false;
    this.server = null;

    this.userId = 0;
    this.channelID = 0
    this.nick = "";
    this.timestamp = null;
  }
}
