'use strict';

const DiscordMessage = require("./discordMessage");
var theoretically = require("jasmine-theories");

describe("discordMessage", function () {
  theoretically.it("throws error if message is '%s' (not a string)", [null, "", " ", undefined], function (insertedValue) {
    expect(function () {
      new DiscordMessage(insertedValue);
    }).toThrow();
  });

  it("sets command to empty string when command not found", function () {
    const message = "this is a message without a command";
    const action = new DiscordMessage(message);
    expect(action.command).toBe("");
  });

  it("sets data to empty string when command not found", function () {
    const message = "this is a message without a command";
    const action = new DiscordMessage(message);
    expect(action.data).toBe("");
  });

  it("sets command to passed command string without bang when command found", function () {
    const message = "!mycommand";
    const action = new DiscordMessage(message);
    expect(action.command).toBe("mycommand");
  });

  it("sets command to lowercase command string when command found", function () {
    const message = "!MYCommanD";
    const action = new DiscordMessage(message);
    expect(action.command).toBe("mycommand");
  });

  it("strips spaces from command string when command found", function () {
    const message = "!mycommand  ";
    const action = new DiscordMessage(message);
    expect(action.command).toBe("mycommand");
  });

  it("sets data to empty string when command found without data", function () {
    const message = "!commandwithoutdata";
    const action = new DiscordMessage(message);
    expect(action.data).toBe("");
  });

  it("sets data to expected data string when command found with data", function () {
    const message = "!jeffscommand jeff is a";
    const action = new DiscordMessage(message);
    expect(action.data).toBe("jeff is a");
  });
});
