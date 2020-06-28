'use strict';

const Discord = require("discord.js");
const DiscordChatListener = require("./discordChatListener");
const DiscordMessageResolver = require("@chatListeners/discord/discordMessageResolver");
const ActionHandlerMessage = require("@actions/actionHandlerMessage");
const faker = require('faker');
var theoretically = require("jasmine-theories");

describe("discordChatListener", () => {
  let discordClient;
  let logger;
  let discordChatListenerConfig;

  beforeEach(() => {
    discordClient = new Discord.Client();
    spyOn(discordClient, "login")
      .and.resolveTo(Promise.resolve());
    logger = jasmine.createSpyObj("logger", ["log"]);
    discordChatListenerConfig = {
      "token": faker.lorem.word()
    };
  });

  it("sets logger property from logger injection", () => {
    // Arrange

    // Act
    const listener = new DiscordChatListener({ logger, discordChatListenerConfig });

    // Assert
    expect(listener.logger).toBe(logger);
  });

  it("sets config property from discordChatListenerConfig", () => {
    // Arrange
    // Act
    const listener = new DiscordChatListener({ discordChatListenerConfig });

    // Assert
    expect(listener.config).toBe(discordChatListenerConfig);
  });

  it("sets discord property from discord injection", () => {
    // Arrange

    // Act
    const listener = new DiscordChatListener({ discordClient, discordChatListenerConfig });

    // Assert
    expect(listener.client).toBe(discordClient);
  });

  // init()
  it("init() passes token to discordClient.login", async () => {
    // Arrange
    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig });

    // Act
    await listener.init();

    // Assert
    expect(discordClient.login).toHaveBeenCalledWith(discordChatListenerConfig.token);
  });

  it("init() resolves when client.login() resolves", async () => {
    // Arrange
    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig });

    // Act & Assert
    await expectAsync(listener.init()).toBeResolved();
  });

  it("init() registers message handler callback when client.login() resolves", async () => {
    // Arrange
    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig });
    spyOn(discordClient, "on");

    // Act
    await listener.init();

    expect(discordClient.on).toHaveBeenCalledTimes(1);
    expect(discordClient.on)
      .toHaveBeenCalledWith("message", jasmine.anything());
  });

  it("init() bubbles reject and does not register message handler callback when client.login() rejected", async () => {
    // Arrange
    discordClient = new Discord.Client();
    spyOn(discordClient, "login")
      .and.rejectWith("login error");
    spyOn(discordClient, "on");
    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig });

    // Act
    await expectAsync(listener.init()).toBeRejected();
    expect(discordClient.on).toHaveBeenCalledTimes(0);
  });

  // messageHandler()
  theoretically.it("returns without error when msg is '%s'", [null, "", " ", undefined], (insertedValue) => {
    // Arrange
    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig });

    // Act
    const actualResult = listener.messageHandler(insertedValue);

    // Assert
    expect(actualResult).toBe(undefined);
  });

  it("resolves discord message with discordMessageResolver", () => {
    // Arrange
    const discordMessageResolver = jasmine.createSpyObj("discordMessageResolver", {
      resolve: new ActionHandlerMessage()
    });

    const discordMessage = jasmine.createSpyObj("discordMessage", ["reply"]);

    const genericActionHandler = jasmine.createSpyObj("genericActionHandler", ["handle"])

    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig, discordMessageResolver, genericActionHandler });

    // Act
    listener.messageHandler(discordMessage);

    // Assert
    expect(discordMessageResolver.resolve).toHaveBeenCalledWith(discordMessage);
  });

  it("passes resolve result to generic action handler if isBangCommand is false", () => {
    // Arrange
    const resolvedMessage = new ActionHandlerMessage();
    resolvedMessage.isBangCommand = false;

    const discordMessageResolver = jasmine.createSpyObj("discordMessageResolver", {
      resolve: resolvedMessage
    });

    const discordMessage = jasmine.createSpyObj("discordMessage", ["reply"]);

    const genericActionHandler = jasmine.createSpyObj("genericActionHandler", ["handle"])

    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig, discordMessageResolver, genericActionHandler });

    // Act
    listener.messageHandler(discordMessage);

    // Assert
    expect(genericActionHandler.handle).toHaveBeenCalledWith(resolvedMessage);
  });

  // TODO Complete messageHandler tests
});
