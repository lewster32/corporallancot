'use strict';

const DiscordChatListenerConfig = require("./discordChatListenerConfig");

describe("discordChatListenerConfig", function () {
  it("maps injected appConfig.discord.key property to .token", () => {
    // Arrange
    const appConfig = {
      discord: {
        key: "mytestkey"
      }
    };

    // Act
    const actualResult = new DiscordChatListenerConfig({ appConfig });

    // Assert
    expect(actualResult.token).toBe(appConfig.discord.key);
  });

  it("returns null .token when discord property is not defined in config file", () => {
    // Arrange
    const appConfig = {};

    // Act
    const actualResult = new DiscordChatListenerConfig({ appConfig })

    // Assert
    expect(actualResult.token).toBe(null);
  });
});
