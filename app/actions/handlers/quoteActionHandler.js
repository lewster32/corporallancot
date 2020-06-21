'use strict';

const ActionHandlerBase = require("@actions/actionHandlerBase");

module.exports = class QuoteActionHandler extends ActionHandlerBase {
  constructor({ logger, notesActionPersistenceHandler }) {
    super(logger, "quote");
    this.persistenceHandler = notesActionPersistenceHandler;
    this.help = "`!quote <search>` finds a note (if `search` is omitted, I'll just find a random note).";
  }

  async handle(action) {
    if (!action) {
      return;
    }

    if (!action.data) {
      try {
        const [rows] = await this.persistenceHandler.getRandomNote();
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
        const [rows] = await this.persistenceHandler.getRandomNoteByContent(action.data);
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
