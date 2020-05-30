const ActionHandler = require("../actionhandler");

module.exports = class QuoteActionHandler extends ActionHandler {
  help =
    "`!quote <search>` finds a note (if `search` is omitted, I'll just find a random note).";

  constructor(bot) {
    super(bot, "quote");
  }

  handle(action, msg) {
    return new Promise((resolve, reject) => {
      if (!action) {
        reject();
      }
      if (!action.data) {
        this.bot.db.query(
          `SELECT * FROM notes ORDER BY RAND() LIMIT 1;`,
          (err, result) => {
            if (err) {
              reject("sorry, there's been an error!");
              console.error(err);
              return;
            } else if (result.length < 1) {
              resolve("I couldn't find any notes!");
              return;
            }
            resolve(
              `\`${result[0]["nick"]}\`: \`\`\`${result[0].message}\`\`\``
            );
          }
        );
      } else {
        this.bot.db.query(
          `SELECT * FROM notes WHERE message LIKE ? ORDER BY RAND() LIMIT 1;`,
          ["%" + action.data + "%"],
          (err, result) => {
            if (err) {
              reject("sorry, there's been an error!");
              console.error(err);
              return;
            } else if (result.length < 1) {
              resolve("I couldn't find any notes matching your search!");
              return;
            }
            resolve(
              `\`${result[0]["nick"]}\`: \`\`\`${result[0].message}\`\`\``
            );
          }
        );
      }
    });
  }
};
