'use strict';

const DbConfig = require("./dbConfig");

describe("dbConfig", function () {
  it("maps injected appConfig.db property to .database", function () {
    const appConfig = {
      db: "test_database"
    };
    const dbConfig = new DbConfig(appConfig);
    expect(dbConfig.database).toBe(appConfig.db);
  });

  it("maps injected appConfig.dbTable property to .notesTable", function () {
    const appConfig = {
      dbTable: "test_table"
    };
    const dbConfig = new DbConfig(appConfig);
    expect(dbConfig.notesTable).toBe(appConfig.dbTable);
  });

  it("maps injected appConfig.dbHost property to .server", function () {
    const appConfig = {
      dbHost: "test_server"
    };
    const dbConfig = new DbConfig(appConfig);
    expect(dbConfig.server).toBe(appConfig.dbHost);
  });

  it("maps injected appConfig.dbUser property to .username", function () {
    const appConfig = {
      dbUser: "test_user"
    };
    const dbConfig = new DbConfig(appConfig);
    expect(dbConfig.username).toBe(appConfig.dbUser);
  });

  it("maps injected appConfig.dbPassword property to .password", function () {
    const appConfig = {
      dbPassword: "test_password"
    };
    const dbConfig = new DbConfig(appConfig);
    expect(dbConfig.password).toBe(appConfig.dbPassword);
  });

  it("maps injected appConfig.dbConnectionRetryCount property to .connRetryCount", function () {
    const appConfig = {
      dbConnectionRetryCount: 3
    };
    const dbConfig = new DbConfig(appConfig);
    expect(dbConfig.dbConnectionRetryCount).toBe(appConfig.dbConnectionRetryCount);
  });

  it("maps injected appConfig.dbConnectionRetryDelay property to .connRetryDelay", function () {
    const appConfig = {
      dbConnectionRetryDelay: 3000
    };
    const dbConfig = new DbConfig(appConfig);
    expect(dbConfig.dbConnectionRetryDelay).toBe(appConfig.connRetryDelay);
  });

  it("uses default value of 'localhost' for .server if appConfig.dbHost is empty", function () {
    const appConfig = {};
    const dbConfig = new DbConfig(appConfig);
    expect(dbConfig.server).toBe("localhost");
  });

  it("uses default value of 'notes' for .notesTable if appConfig.dbTable is empty", function () {
    const appConfig = {};
    const dbConfig = new DbConfig(appConfig);
    expect(dbConfig.notesTable).toBe("notes");
  });
});
