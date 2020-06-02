const ActionHandler = require("@actions/actionhandler");

module.exports = class QuoteActionHandler extends ActionHandler {
  help =
    "`!quote <search>` finds a note (if `search` is omitted, I'll just find a random note).";

  constructor(bot) {
    super(bot, "quote");
  }

  async handle(action, msg) {
    if (!action) {
      return;
    }
    if (!action.data) {
      try {
        const [rows, fields] = await this.bot.db.query(
          `SELECT nick, message FROM ${this.bot.appConfig.dbTable} ORDER BY RAND() LIMIT 1;`
        );
        if (rows.length) {
          return `\`${rows[0]["nick"]}\`: \`\`\`${rows[0].message}\`\`\``;
        } else {
          return "I couldn't find any notes!";
        }
      } catch (e) {
        console.error(e);
        return "sorry, there's been an error!";
      }
    } else {
      try {
        const [
          rows,
          fields,
        ] = await this.bot.db.query(
          `SELECT nick, message FROM ${this.bot.appConfig.dbTable} WHERE message LIKE ? ORDER BY RAND() LIMIT 1;`,
          ["%" + action.data + "%"]
        );
        if (rows.length) {
          return `\`${rows[0]["nick"]}\`: \`\`\`${rows[0].message}\`\`\``;
        } else {
          return "I couldn't find any notes matching your search!";
        }
      } catch (e) {
        console.error(e);
        return "sorry, there's been an error!";
      }
    }
  }
};
