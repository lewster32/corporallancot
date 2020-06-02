const ActionHandler = require("@actions/actionhandler");

module.exports = class QuoteActionHandler extends ActionHandler {
  help =
    "`!quote <search>` finds a note (if `search` is omitted, I'll just find a random note).";

  constructor({ logger, db }) {
    super(logger, "quote");
    this.db = db;
  }

  async handle(action, msg) {
    if (!action) {
      return;
    }

    if (!action.data) {
      try {
        const [rows] = await this.db.getRandomNote();
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
        const [rows] = await this.db.getRandomNoteByContent(action.data);
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
