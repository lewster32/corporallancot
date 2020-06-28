'use strict';

const fs = require("fs");

module.exports = ({ configFilePath, environment }) => {
  const config = JSON.parse(fs.readFileSync(configFilePath));
  if (!environment) {
    throw new Error("environment not found");
  }
  // Override secrets with specific env settings
  const discord = config.bot.chatListeners.find(x => x.name == "discord");
  discord.settings.key = environment.BOT_DISCORD_KEY;

  config.database.name = environment.BOT_DB_NAME;
  config.database.server = environment.BOT_DB_SERVER;
  config.database.user = environment.BOT_DB_USER;
  config.database.password = environment.BOT_DB_PASSWORD;
  return config;
}
