'use strict';

module.exports = class Db {
  constructor({ mySql, dbConfig, logger }) {
    this.mysql = mySql;
    this.logger = logger;
    this.dbConfig = dbConfig;
  }

  async connect() {
    this.logger.log(`Connecting to '${this.dbConfig.database}' database on server '${this.dbConfig.server}'`);

    let retry = 0;
    const retryCount = this.dbConfig.connRetryCount;
    const retryDelay = this.dbConfig.connRetryDelay;

    while (!this.connection) {
      try {
        this.connection = await this.tryConnection();
        break;
      } catch (e) {
        if (e.code === 'ECONNREFUSED') {
          if (retry >= retryCount) {
            this.logger.log(`Database connection timeout. Retries exceeded (${retryCount})`);
            throw e;
          }
          retry++;
          this.logger.log(`Connection failed. Retry ${retry} in ${retryDelay}ms`);
          await this.sleep(retryDelay);
          continue;
        }
        throw e;
      }
    }
    this.logger.log(`Connected to database '${this.connection.config.host}'`);
  }

  async tryConnection() {
    return await this.mysql.createConnection({
      host: this.dbConfig.server,
      user: this.dbConfig.username,
      password: this.dbConfig.password,
      database: this.dbConfig.database,
    });
  }

  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async setupTable() {
    this.logger.log(`Checking '${this.dbConfig.notesTable}' table`);

    const [resultHeader] = await this.connection.query(`
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
    return await this.connection.query(
      `INSERT INTO ${this.dbConfig.notesTable} (timestamp, user_id, channel_id, nick, message) VALUES (?, ?, ?, ?, ?);`,
      [timestamp, userID, channelID, nick, message]
    );
  }

  async getRandomNote() {
    return await this.connection.query(
      `SELECT nick, message FROM ${this.dbConfig.notesTable} ORDER BY RAND() LIMIT 1;`
    );
  }

  async getRandomNoteByContent(message) {
    return await this.connection.query(
      `SELECT nick, message FROM ${this.dbConfig.notesTable} WHERE message LIKE ? ORDER BY RAND() LIMIT 1;`,
      [`%${message}%`]
    );
  }
}
