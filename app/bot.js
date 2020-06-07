'use strict';

const DiscordMessage = require("./actions/actionMessage");

module.exports = class Bot {
  constructor({
    appConfig,
    actions,
    discord,
    dbAdapter,
    botVersion,
    botName,
    botDescription,
    logger
  }) {
    this.logger = logger;
    this.logger.log(`*** Welcome to ${botName} v${botVersion}! ***`);
    this.logger.log(`*** ${botDescription} ***`);

    this.actions = actions;
    this.appConfig = appConfig;
    this.discord = discord;
    this.dbAdapter = dbAdapter;

    if (!this.discord || !this.dbAdapter || !this.actions || !this.appConfig) {
      throw new Error("Missing required constructor dependencies");
    }
  }

  async init() {
    this.logger.log("Initialising bot");
    await this.dbAdapter.connect();
    // await this.dbAdapter.setupTable();
    await this.initDiscord();
    this.logger.log("Initialisation complete");
    await this.listen();
  }

  async initDiscord() {
    this.logger.log("Logging in to Discord");
    return new Promise((resolve, reject) => {
      try {
        this.client = new this.discord.Client();
        this.client.once("ready", () => {
          this.logger.log("Logged into Discord");
          resolve(true);
        });

        this.client.login(this.appConfig.key);
      } catch (e) {
        reject(e);
      }
    });
  }

  async listen() {
    this.logger.log("Listening for commands");
    this.client.on("message", this.listenHandler.bind(this));
  }

  async listenHandler(msg) {
    const content = msg.content;
    if (!content || !(content[0] === "!")) {
      return;
    }
    this.logger.log(`Bang command found in message '${content}'`);

    const action = new DiscordMessage(content);
    if (action && action.command) {
      let reply = "";
      const handler = this.actions.filter((x) => x.isMatch(action));

      this.logger.log(`Received command '${msg.content}' from '${msg.author.username}'`);

      if (!handler || !handler.length) {
        reply = "I don't recognise that command.";
      } else {
        try {
          reply = await handler[0].handle(action, msg);
        } catch (e) {
          reply = `Halt! An error occurred: ${e.toString()}`;
        } finally {
          this.logger.log(`Reply set to '${reply}'`);
          if (reply) {
            msg.reply(reply);
          }
        }
      }
    }
  }
};
