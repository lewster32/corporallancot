'use strict';

const AppConfig = require("./appConfig");

describe("appConfig", function () {
  it("throws error if configFilePath is not found", function () {
    const configFilePath = "not_a_real_file";
    expect(function () {
      AppConfig({ configFilePath: configFilePath });
    }).toThrow();
  });

  it("parses json file contents as object", function () {
    const configFilePath = "package.json";
    const fileContents = AppConfig({ configFilePath: configFilePath });
    expect(fileContents).toBeDefined();
    expect(fileContents.name).toBe("corporal-lancot");
  });
});
