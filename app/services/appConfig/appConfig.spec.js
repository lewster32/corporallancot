'use strict';

const AppConfig = require("./appConfig");
const faker = require('faker');

describe("appConfig", function () {
  it("throws error if configFilePath is not found", function () {
    const configFilePath = "not_a_real_file";
    expect(function () {
      AppConfig({ configFilePath });
    }).toThrowError(`ENOENT: no such file or directory, open '${configFilePath}'`);
  });

  it("throws error if environment is not found", function () {
    const configFilePath = "config.json";
    expect(() => {
      AppConfig({ configFilePath: configFilePath });
    }).toThrowError("environment not found");
  });

  it("parses config.json file contents as object", function () {
    const configFilePath = "config.json";
    const environment = faker.fake;
    const appConfig = AppConfig({ configFilePath, environment });
    expect(appConfig).toBeDefined();
  });

  // Sensitive info mapping
  it("sets environment BOT_DISCORD_KEY to discord.key", function () {
    const expectedValue = faker.lorem.word();
    const configFilePath = "config.json";
    const environment = {
      BOT_DISCORD_KEY: expectedValue
    };
    const appConfig = AppConfig({ configFilePath, environment });
    expect(appConfig.discord.key).toBe(expectedValue);
  });

  it("sets environment BOT_DB_NAME to database.name", function () {
    const expectedValue = faker.lorem.word();
    const configFilePath = "config.json";
    const environment = {
      BOT_DB_NAME: expectedValue
    };
    const appConfig = AppConfig({ configFilePath, environment });
    expect(appConfig.database.name).toBe(expectedValue);
  });

  it("sets environment BOT_DB_SERVER to database.name", function () {
    const expectedValue = faker.lorem.word();
    const configFilePath = "config.json";
    const environment = {
      BOT_DB_SERVER: expectedValue
    };
    const appConfig = AppConfig({ configFilePath, environment });
    expect(appConfig.database.server).toBe(expectedValue);
  });

  it("sets environment BOT_DB_USER to database.name", function () {
    const expectedValue = faker.lorem.word();
    const configFilePath = "config.json";
    const environment = {
      BOT_DB_USER: expectedValue
    };
    const appConfig = AppConfig({ configFilePath, environment });
    expect(appConfig.database.user).toBe(expectedValue);
  });

  it("sets environment BOT_DB_PASSWORD to database.name", function () {
    const expectedValue = faker.lorem.word();
    const configFilePath = "config.json";
    const environment = {
      BOT_DB_PASSWORD: expectedValue
    };
    const appConfig = AppConfig({ configFilePath, environment });
    expect(appConfig.database.password).toBe(expectedValue);
  });
});
