'use strict';

module.exports = class DiscordChatListener {
  constructor({ logger, actionHandlerResolver, discordChatListenerConfig, discordClient, discordMessageResolver }) {
    this.logger = logger;
    this.config = discordChatListenerConfig;
    this.client = discordClient;
    this.messageResolver = discordMessageResolver;
    this.actionHandlerResolver = actionHandlerResolver;
    this.logPrefix = `[${this.constructor.name}] `;
  }

  async init() {
    this.logger.log(`${this.logPrefix}Initialising - logging in`);

    await this.client
      .login(this.config.token)
      .then(() => {
        this.logger.log(`${this.logPrefix}Logged in`);
        this.logger.log(`${this.logPrefix}Registering message listener`);

        this.client.on("message", async (msg) => {
          await this.handleMessage(msg)
            .catch((e) => {
              this.logger.log(`${this.logPrefix}Discord message handling error:\n`, e);
            });
        });

        this.logger.log(`${this.logPrefix}Message listener registered`);
      });

    this.logger.log(`${this.logPrefix}Initialised successfully`);
  }

  async handleMessage(discordMessage) {
    if (!discordMessage || !(typeof discordMessage === "object")) {
      return;
    }

    this.logger.log(`${this.logPrefix}Received content '${discordMessage.content}'`);

    const actionHandlerMessage = await this.messageResolver.resolve(discordMessage);

    const actionHandler = await this.actionHandlerResolver.resolve(actionHandlerMessage);

    const reply = await actionHandler.handle(actionHandlerMessage);

    discordMessage.reply(reply);
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
