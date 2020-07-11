'use strict';

const DiscordChatListener = require("./discordChatListener");
const faker = require('faker');
var theoretically = require("jasmine-theories");

describe("discordChatListener init()", () => {
  let discordClient;
  let logger;
  let discordChatListenerConfig;

  beforeEach(() => {
    discordClient = jasmine.createSpyObj("discordClient", {
      login: Promise.resolve(),
      on: null
    });
    logger = jasmine.createSpyObj("logger", ["log"]);
    discordChatListenerConfig = jasmine.createSpyObj("discordChatListenerConfig", {
      token: faker.lorem.word()
    });
  });

  it("sets logger property from logger injection", () => {
    // Act
    const listener = new DiscordChatListener({ logger, discordChatListenerConfig });

    // Assert
    expect(listener.logger).toBe(logger);
  });

  it("sets config property from discordChatListenerConfig injection", () => {
    // Act
    const listener = new DiscordChatListener({ discordChatListenerConfig });

    // Assert
    expect(listener.config).toBe(discordChatListenerConfig);
  });

  it("sets client property from discordClient injection", () => {
    // Act
    const listener = new DiscordChatListener({ discordClient, discordChatListenerConfig });

    // Assert
    expect(listener.client).toBe(discordClient);
  });

  // init()
  it("passes token to discordClient.login", async () => {
    // Arrange
    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig });

    // Act
    await listener.init();

    // Assert
    expect(discordClient.login).toHaveBeenCalledWith(discordChatListenerConfig.token);
  });

  it("resolves when client.login() resolves", async () => {
    // Arrange
    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig });

    // Act & Assert
    await expectAsync(listener.init()).toBeResolved();
  });

  it("registers message handler callback when client.login() resolves", async () => {
    // Arrange
    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig });

    // Act
    await listener.init();

    // Assert
    expect(discordClient.on).toHaveBeenCalledTimes(1);
    expect(discordClient.on)
      .toHaveBeenCalledWith("message", jasmine.anything());
  });

  it("init() bubbles reject and does not register message handler callback when client.login() rejected", async () => {
    // Arrange
    discordClient = jasmine.createSpyObj("discordClient", {
      login: Promise.reject("login error"),
      on: null
    });
    const listener = new DiscordChatListener({ logger, discordClient, discordChatListenerConfig });

    // Act & Assert
    await expectAsync(listener.init()).toBeRejected();
    expect(discordClient.on).toHaveBeenCalledTimes(0);
  });
});

describe("discordChatListener handleMessage()", () => {
  let logger;
  let actionHandlerResolver;
  let discordMessageResolver;
  let discordMessage;

  beforeEach(() => {
    logger = jasmine.createSpyObj("logger", ["log"]);
    actionHandlerResolver = jasmine.createSpyObj("actionHandlerResolver", {
      resolve: jasmine.createSpyObj("actionHandler", ["handle"])
    });
    discordMessageResolver = jasmine.createSpyObj("discordMessageResolver", ["resolve"]);
    discordMessage = jasmine.createSpyObj("discordMessage", ["reply"]);
  });

  theoretically.it("returns without error when discordMessage is '%s'", [null, "", " ", undefined], async (insertedValue) => {
    // Arrange
    const listener = new DiscordChatListener({ logger });

    // Act
    const actualResult = await listener.handleMessage(insertedValue);

    // Assert
    expect(actualResult).toBe(undefined);
  });

  it("resolves discord message to ActionHandlerMessage", async () => {
    // Arrange
    const listener = new DiscordChatListener({ logger, actionHandlerResolver, discordMessageResolver });

    // Act
    await listener.handleMessage(discordMessage);

    // Assert
    expect(discordMessageResolver.resolve).toHaveBeenCalledWith(discordMessage);
  });

  it("resolves ActionHandler with ActionHandlerMessage", async () => {
    // Arrange
    const actionHandlerMessage = jasmine.createSpy("actionHandlerMessage");
    discordMessageResolver = jasmine.createSpyObj("discordMessageResolver", {
      resolve: actionHandlerMessage
    });

    const listener = new DiscordChatListener({ logger, actionHandlerResolver, discordMessageResolver });

    // Act
    await listener.handleMessage(discordMessage);

    // Assert
    expect(actionHandlerResolver.resolve).toHaveBeenCalledWith(actionHandlerMessage);
  });

  it("asynchronously handles message with resolved ActionHandler's handle() method", async () => {
    // Arrange
    const actionHandlerMessage = jasmine.createSpy("actionHandlerMessage");
    discordMessageResolver = jasmine.createSpyObj("discordMessageResolver", {
      resolve: actionHandlerMessage
    });
    const actionHandler = jasmine.createSpyObj("actionHandler", {
      handle: async () => {
        Promise.resolve();
      }
    });
    actionHandlerResolver = jasmine.createSpyObj("actionHandlerResolver", {
      resolve: actionHandler
    });

    const listener = new DiscordChatListener({ logger, actionHandlerResolver, discordMessageResolver });

    // Act
    await listener.handleMessage(discordMessage);

    // Assert
    expect(actionHandler.handle).toHaveBeenCalledWith(actionHandlerMessage);
  });

  it("replies to the discordMessage with the ActionHandler's response", async () => {
    // Arrange
    const expectedReply = faker.lorem.sentences();
    actionHandlerResolver = jasmine.createSpyObj("actionHandlerResolver", {
      resolve: jasmine.createSpyObj("actionHandler", {
        handle: expectedReply
      })
    });

    const listener = new DiscordChatListener({ logger, actionHandlerResolver, discordMessageResolver });

    // Act
    await listener.handleMessage(discordMessage);

    // Assert
    expect(discordMessage.reply).toHaveBeenCalledWith(expectedReply);
  });
});
