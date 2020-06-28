'use strict';

module.exports = class DiscordChatListener {
  constructor({ logger, discordChatListenerConfig, discordClient, discordMessageResolver, genericActionHandler }) {
    this.logger = logger;
    this.config = discordChatListenerConfig;
    this.client = discordClient;
    this.messageResolver = discordMessageResolver;
    this.genericActionHandler = genericActionHandler;
    this.logPrefix = `[${this.constructor.name}] `;
  }

  async init() {
    this.logger.log(`${this.logPrefix}Initialising - logging in to Discord`);

    await this.client
      .login(this.config.token)
      .then(() => {
        this.logger.log(`${this.logPrefix}Logged in to Discord`);
        this.logger.log(`${this.logPrefix}Registering message listener`);

        this.client.on("message", msg => this.messageHandler(msg));

        this.logger.log(`${this.logPrefix}Registered message listener`);
      });

    this.logger.log(`${this.logPrefix}Initialised successfully`);
  }

  messageHandler(discordMessage) {
    if (!discordMessage || !(typeof discordMessage === "object")) {
      return;
    }
    const content = discordMessage.content;

    this.logger.log(`${this.logPrefix}Received content '${content}'`);
    const message = this.messageResolver.resolve(discordMessage);

    if (!message.isBangCommand) {
      this.genericActionHandler.handle(message);
    }

    return "jeff";
  }
  // async listenHandler(msg) {
  //   const content = msg.content;
  //   if (!content || !(content[0] === "!")) {
  //     return;
  //   }
  //   this.logger.log(`${this.logPrefix}Bang command found in message '${content}'`);

  //   const action = new ActionMessage(content);
  //   if (action && action.command) {
  //     let reply = "";
  //     const handler = this.actions.filter((x) => x.isMatch(action));

  //     this.logger.log(`${this.logPrefix}Received command '${msg.content}' from '${msg.author.username}'`);

  //     if (!handler || !handler.length) {
  //       reply = "I don't recognise that command.";
  //     } else {
  //       try {
  //         reply = await handler[0].handle(action, msg);
  //       } catch (e) {
  //         reply = `Halt! An error occurred: ${e.toString()}`;
  //       } finally {
  //         this.logger.log(`${this.logPrefix}Reply set to '${reply}'`);
  //         if (reply) {
  //           msg.reply(reply);
  //         }
  //       }
  //     }
  //   }
  // }
}
