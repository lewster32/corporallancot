'use strict';

const ActionPersistenceHandlerBase = require("@actions/actionPersistenceHandlerBase");

module.exports = class NotesActionPersistenceHandler extends ActionPersistenceHandlerBase {
  constructor({ logger, notesRepository }) {
    super(logger, notesRepository);

    this.logPrefix = `[${this.constructor.name}] `;
    this.logger.log(`${this.logPrefix}Initialising action persistence handler`);
  }

  async insertNote(timestamp, userID, channelID, nick, message) {
    return await this.repository.insertNote(timestamp, userID, channelID, nick, message);
  }

  async getRandomNote() {
    return await this.repository.getRandomNote();
  }

  async getRandomNoteByContent(message) {
    return await this.repository.getRandomNoteByContent(message);
  }
};
