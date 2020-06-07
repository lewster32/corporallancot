'use strict';

const DbAdapter = require("@services/db/dbAdapter");

module.exports = class MariaDbAdapter extends DbAdapter {
  constructor({ mySql, dbConfig, logger }) {
    super(dbConfig, logger);
    this.mysql = mySql;
    this.connection = null;
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

  // TODO: Implement generic calls to connection.query etc
  async execute() {
    throw "TBD";
  }

  async create() {
    throw "TBD";
  }

  async read() {
    throw "TBD";
  }

  async update() {
    throw "TBD";
  }

  async delete() {
    throw "TBD";
  }
}
