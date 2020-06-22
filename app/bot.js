'use strict';

const DiscordMessage = require("./actions/actionMessage");

module.exports = class Bot {
  constructor({
    discordChatListenerConfig,
    actions,
    discord,
    botConfig,
    logger
  }) {
    this.logPrefix = `[${this.constructor.name}] `;
    this.logger = logger;
    this.logger.log(`${this.logPrefix}*** Welcome to ${botConfig.name} v${botConfig.version}! ***`);
    this.logger.log(`${this.logPrefix}*** ${botConfig.description} ***`);

    this.actions = actions;
    this.discordToken = discordChatListenerConfig.token;
    this.discord = discord;
  }

  async init() {
    this.logger.log(`${this.logPrefix}Initialising bot`);
    await this.initDiscord();
    this.logger.log(`${this.logPrefix}Initialisation complete`);
    await this.listen();
  }

  async initDiscord() {
    this.logger.log(`${this.logPrefix}Logging in to Discord`);
    return new Promise((resolve, reject) => {
      try {
        this.client = new this.discord.Client();
        this.client.once("ready", () => {
          this.logger.log(`${this.logPrefix}Logged into Discord`);
          resolve(true);
        });

        this.client.login(this.discordToken);
      } catch (e) {
        reject(e);
      }
    });
  }

  async listen() {
    this.logger.log(`${this.logPrefix}Listening for commands`);
    this.client.on("message", this.listenHandler.bind(this));
  }

  async listenHandler(msg) {
    const content = msg.content;
    if (!content || !(content[0] === "!")) {
      return;
    }
    this.logger.log(`${this.logPrefix}Bang command found in message '${content}'`);

    const action = new DiscordMessage(content);
    if (action && action.command) {
      let reply = "";
      const handler = this.actions.filter((x) => x.isMatch(action));

      this.logger.log(`${this.logPrefix}Received command '${msg.content}' from '${msg.author.username}'`);

      if (!handler || !handler.length) {
        reply = "I don't recognise that command.";
      } else {
        try {
          reply = await handler[0].handle(action, msg);
        } catch (e) {
          reply = `Halt! An error occurred: ${e.toString()}`;
        } finally {
          this.logger.log(`${this.logPrefix}Reply set to '${reply}'`);
          if (reply) {
            msg.reply(reply);
          }
        }
      }
    }
  }
};
