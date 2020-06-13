module.exports = class NotesRepository {
  constructor({ dbAdapter, logger }) {
    this.logger = logger;
    this.dbAdapter = dbAdapter;
    this.tableName = "notes";
    this.logPrefix = `[${this.constructor.name}] `;
    this.logger.log(`${this.logPrefix}Initialising repository`);

    (async () => {
      await this.dbAdapter
        .connect()
        .catch((e) => {
          this.logger.log(`${this.logPrefix}A fatal error occurred when connecting to the database:\n`, e);
        });
      await this
        .setupTable()
        .catch((e) => {
        this.logger.log(`${this.logPrefix}A fatal error occurred when setting up the notes table:\n`, e);
      });
    })();
  }

  async setupTable() {
    // TODO: Write tests to ensure that the table is only set up once
    this.logger.log(`${this.logPrefix}Checking '${this.tableName}' table`);

    const [resultHeader] = await this.dbAdapter.connection.query(`
CREATE TABLE IF NOT EXISTS ${this.tableName} (
  id          INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  timestamp   DATETIME,
  user_id     BIGINT(8),
  channel_id  BIGINT(8),
  nick        VARCHAR(255) NOT NULL,
  message     LONGTEXT NOT NULL
);`);
    if (resultHeader.warningStatus === 0) {
      this.logger.log(`${this.logPrefix}'${this.tableName}' table created`);
    } else {
      this.logger.log(`${this.logPrefix}'${this.tableName}' table already exists`);
    }
  }

  async insertNote(timestamp, userID, channelID, nick, message) {
    this.logger.log(`${this.logPrefix}Inserting new note`);
    await this.dbAdapter.connection.query(`INSERT INTO ${this.tableName} (timestamp, user_id, channel_id, nick, message) VALUES (?, ?, ?, ?, ?);`,
      [timestamp, userID, channelID, nick, message]
    );
  }

  async getRandomNote() {
    this.logger.log(`${this.logPrefix}Retrieving random note`);
    return await this.dbAdapter.connection.query(
      `SELECT nick, message FROM ${this.tableName} ORDER BY RAND() LIMIT 1;`
    );
  }

  async getRandomNoteByContent(message) {
    this.logger.log(`${this.logPrefix}Retrieving random note with search term '${message}'`);
    return await this.dbAdapter.connection.query(
      `SELECT nick, message FROM ${this.tableName} WHERE message LIKE ? ORDER BY RAND() LIMIT 1;`,
      [`%${message}%`]
    );
  }
}
