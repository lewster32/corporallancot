'use strict';

const MessageResolverBase = require("@chatListeners/messageResolverBase");
const ActionHandlerMessage = require("@actionHandlers/actionHandlerMessage");

module.exports = class DiscordMessageResolver extends MessageResolverBase {
  constructor({ logger }) {
    super();
    this.logger = logger;
    this.logPrefix = `[${this.constructor.name}] `;
  }

  /**
   * Resolves a discord message to an @class ActionHandlerMessage
   */
  async resolve(discordMessage) {
    const message = super.resolveChatMessage(discordMessage.content);

    // Append discord specific message content
    message.server = "discord";

    // Ugh, null coalesce plsthxadmin!
    if (discordMessage) {
      message.timestamp = discordMessage.createdAt;
      if (discordMessage.author) {
        message.userId = discordMessage.author.id;
        message.nick = discordMessage.author.username;
      }
      if (discordMessage.channel) {
        message.channelId = discordMessage.channel.id;
      }
    }
    return message;
  }
}
