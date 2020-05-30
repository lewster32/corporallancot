const ActionHandler = require("../actionhandler");

module.exports = class NotesActionHandler extends ActionHandler {
  help = "`!notes [message]` records a note.";

  constructor(bot) {
    super(bot, "notes");
  }

  handle(action, msg) {
    return new Promise((resolve, reject) => {
      if (!action || !msg) {
        reject();
      }
      const userID = msg.author.id;
      const channelID = msg.channel.id;
      const nick = msg.author.username;
      const timestamp = msg.createdAt;
      if (!action.data) {
        resolve("I can't record an empty note! " + this.help);
        return;
      }

      this.bot.db.query(
        `INSERT INTO notes (timestamp, user_id, channel_id, nick, message) VALUES (?, ?, ?, ?, ?);`,
        [timestamp, userID, channelID, nick, action.data],
        (err) => {
          if (err) {
            reject("sorry, there's been an error!");
            console.error(err);
            return;
          }
          resolve("thanks, I've recorded that for you.");
        }
      );
    });
  }
};
