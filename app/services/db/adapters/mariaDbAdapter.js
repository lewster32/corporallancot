'use strict';

const DbAdapterBase = require("@services/db/dbAdapterBase");

module.exports = class MariaDbAdapter extends DbAdapterBase {
  constructor({ mySql, dbConfig, logger }) {
    super(dbConfig, logger);
    this.mysql = mySql;
  }

  async connect() {
    // TODO: Write tests to check that this.connection is not already set
    this.logger.log(`Connecting to '${this.dbConfig.database}' database on server '${this.dbConfig.server}'`);

    let retry = 0;
    const retryCount = this.dbConfig.connRetryCount;
    const retryDelay = this.dbConfig.connRetryDelay;

    while (!this.connection) {
    //   try {
         this.connection = await this.tryConnection();
    //     this.logger.log(`Connected to database '${this.connection.config.host}'`);
         break;
    //   } catch (e) {
    //     if (e.code === 'ECONNREFUSED') {
    //       if (retry >= retryCount) {
    //         this.logger.log(`Database connection timeout. Retries exceeded (${retryCount})`);
    //         throw e;
    //       }
    //       retry++;
    //       this.logger.log(`Connection failed. Retry ${retry} in ${retryDelay}ms`);
    //       await this.sleep(retryDelay);
    //       continue;
    //     }
    //     throw e;
    //   }
    }
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
}
