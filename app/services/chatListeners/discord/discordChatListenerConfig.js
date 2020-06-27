'use strict';

module.exports = class DiscordChatListenerConfig {
  constructor({ appConfig }) {
    if (appConfig.discord) {
      this.token = appConfig.discord.key;
      return;
    }

    // Defaults
    this.token = null;
  }
}
