'use strict';

module.exports = class Bot {
  constructor({
    // TODO: Inject all chat listeners via a function...
    discordChatListener,
    // chatListeners,
    botConfig,
    logger
  }) {
    this.logPrefix = `[${this.constructor.name}] `;
    this.logger = logger;
    this.logger.log(`${this.logPrefix}*** Welcome to ${botConfig.name} v${botConfig.version}! ***`);
    this.logger.log(`${this.logPrefix}*** ${botConfig.description} ***`);

    this.discordChatListener = discordChatListener;
  }

  async init() {
    this.logger.log(`${this.logPrefix}Initialising bot`);
    // TODO: Call init() on each loaded chat listener

    await this.discordChatListener.init();
  }
};
