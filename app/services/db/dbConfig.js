'use strict';

module.exports = class DbConfig {
  constructor({ appConfig }) {
    this.database = appConfig.db;
    this.notesTable = appConfig.dbTable || "notes";
    this.server = appConfig.dbHost || "localhost";
    this.username = appConfig.dbUser;
    this.password = appConfig.dbPassword;
    this.connRetryCount = appConfig.dbConnectionRetryCount;
    this.connRetryDelay = appConfig.dbConnectionRetryDelay;
  }
}
