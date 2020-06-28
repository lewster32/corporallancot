'use strict';

const MessageResolverBase = require("@actions/messageResolverBase");

module.exports = class DiscordMessageResolver extends MessageResolverBase {
  resolve(discordMessage) {
    // const message = super.resolveChatMessage(discordMessage.content);
    // TODO: Append discord specific message content
    // return message;
  }
}
