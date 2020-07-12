'use strict';

const NotImplemented = require("@errors/notImplemented");

module.exports = class ChatListenerBase {
  constructor(logger, actionHandlerResolver, messageResolver) {
    this.logger = logger;
    this.actionHandlerResolver = actionHandlerResolver;
    this.messageResolver = messageResolver;
    this.logPrefix = `[${this.constructor.name}] `;
  }

  async init() {
    throw NotImplemented;
  }

  async handleMessage(chatListenerMessage) {
    if (!chatListenerMessage || !(typeof chatListenerMessage === "object")) {
      return;
    }

    const actionHandlerMessage = await this.messageResolver.resolve(chatListenerMessage);

    // Do not attempt to process any bot messages
    if (actionHandlerMessage.isBot === true) {
      return;
    }

    const actionHandler = await this.actionHandlerResolver.resolve(actionHandlerMessage);

    const reply = await actionHandler.handle(actionHandlerMessage);
    if (reply && reply.trimEnd().length > 0) {
      await this.replyAction(chatListenerMessage, reply);
    }
  }

  // Child classes must implement:
  // async replyAction(chatListenerMessage, replyText)
  async replyAction() {
    throw NotImplemented;
  }
}
