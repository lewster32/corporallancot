'use strict';

const ActionPersistenceHandlerBase = require("./actionPersistenceHandlerBase");
const NotImplemented = require("@errors/notImplemented");

describe("actionPersistenceHandlerBase", () => {
  const logger = {
    log: function (msg) { }
  };
  const repository = {
    init: function () { }
  };

  it("sets logger to logger property", () => {
    const handler = new ActionPersistenceHandlerBase(logger);
    expect(handler.logger).toBe(logger);
  });

  it("sets repository to .repository property", () => {
    const handler = new ActionPersistenceHandlerBase({}, repository);
    expect(handler.repository).toBe(repository);
  });

  it("init() resolves asynchronously", async () => {
    // Arrange
    const handler = new ActionPersistenceHandlerBase(logger, repository);
    // Act & Assert
    await expectAsync(handler.init()).toBeResolved();
  });

  it("init() calls logger.log", async () => {
    // Arrange
    spyOn(logger, 'log');
    const handler = new ActionPersistenceHandlerBase(logger, repository);

    // Act
    await handler.init();

    // Assert
    expect(logger.log).toHaveBeenCalled();
  });

  it("init() calls repository.init", async () => {
    // Arrange
    spyOn(repository, 'init');
    const handler = new ActionPersistenceHandlerBase(logger, repository);

    // Act
    await handler.init();

    // Assert
    expect(repository.init).toHaveBeenCalledTimes(1);
  });
});

