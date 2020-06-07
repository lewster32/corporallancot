const NotImplemented = require("@errors/notImplemented");
const ActionPersistenceHandler = require("@actions/actionPersistenceHandler");

module.exports = class NotesActionPersistenceHandler extends ActionPersistenceHandler {
  constructor({ logger, dbAdapter }) {
    super(logger, dbAdapter);
  }

  async init() {
    await this.setupTable();
  }

  async setupTable() {
    this.logger.log(`Checking '${this.dbConfig.notesTable}' table`);

    const [resultHeader] = await this.db.connection.query(`
CREATE TABLE IF NOT EXISTS ${this.dbConfig.notesTable} (
  id          INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  timestamp   DATETIME,
  user_id     BIGINT(8),
  channel_id  BIGINT(8),
  nick        VARCHAR(255) NOT NULL,
  message     LONGTEXT NOT NULL
);`);
    if (resultHeader.warningStatus === 0) {
      this.logger.log(`'${this.dbConfig.notesTable}' table created`);
    } else {
      this.logger.log(`'${this.dbConfig.notesTable}' table already exists`);
    }
  }

  async insertNote(timestamp, userID, channelID, nick, message) {
    return await this.dbAdapter.create(this.dbConfig.notesTable, {
      timestamp, userID, channelID, nick, message
    });
      // `INSERT INTO ${this.dbConfig.notesTable} (timestamp, user_id, channel_id, nick, message) VALUES (?, ?, ?, ?, ?);`,
      // [timestamp, userID, channelID, nick, message]
    // );
  }

  async getRandomNote() {
    return await this.dbAdapter.read(`SELECT nick, message FROM ${this.dbConfig.notesTable} ORDER BY RAND() LIMIT 1;`);
    // return await this.db.connection.query(
    //   `SELECT nick, message FROM ${this.dbConfig.notesTable} ORDER BY RAND() LIMIT 1;`
    // );
  }

  async getRandomNoteByContent(message) {
    return await this.dbAdapter.read(`SELECT nick, message FROM ${this.dbConfig.notesTable} WHERE message LIKE '%${message}%' ORDER BY RAND() LIMIT 1;`);
    // return await this.db.connection.query(
    //   `SELECT nick, message FROM ${this.dbConfig.notesTable} WHERE message LIKE ? ORDER BY RAND() LIMIT 1;`,
    //   [`%${message}%`]
    // );
  }
};
