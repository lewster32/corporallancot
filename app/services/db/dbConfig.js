'use strict';

module.exports = class DbConfig {
  constructor({ appConfig }) {
    this.database = appConfig.db || "notes";
    this.server = appConfig.dbHost || "localhost";
    this.username = appConfig.dbUser;
    this.password = appConfig.dbPassword;
    this.connRetryCount = appConfig.dbConnectionRetryCount || 10;
    this.connRetryDelay = appConfig.dbConnectionRetryDelay || 5000;
  }
}
