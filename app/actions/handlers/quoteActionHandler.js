'use strict';

const ActionHandlerBase = require("@actions/actionHandlerBase");

module.exports = class QuoteActionHandler extends ActionHandlerBase {
  help =
    "`!quote <search>` finds a note (if `search` is omitted, I'll just find a random note).";

  constructor({ logger, notesActionPersistenceHandler }) {
    super(logger, "quote");
    this.persistenceHandler = notesActionPersistenceHandler;

    this.persistenceHandler.init();
  }

  async handle(action, msg) {
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
