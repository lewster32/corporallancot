'use strict';

const ActionHandler = require("@actions/actionHandler");

module.exports = class NotesActionHandler extends ActionHandler {
  help = "`!notes [message]` records a note.";

  constructor({ logger, notesActionPersistenceHandler }) {
    super(logger, "notes");
    this.persistenceHandler = notesActionPersistenceHandler;
  }

  async handle(action, msg) {
    if (!action || !msg) {
      return;
    }
    const userID = msg.author.id;
    const channelID = msg.channel.id;
    const nick = msg.author.username;
    const timestamp = msg.createdAt;
    if (!action.data) {
      return "I can't record an empty note! " + this.help;
    }

    try {
      await this.persistenceHandler.insertNote(timestamp, userID, channelID, nick, action.data);
      return "thanks, I've recorded that for you.";
    } catch (e) {
      console.error(e);
      return "sorry, there's been an error!";
    }
  }
};
