'use strict';

const ActionPersistenceHandlerBase = require("./actionPersistenceHandlerBase");

describe("actionPersistenceHandlerBase", () => {
  const logger = {
    log: function (msg) { }
  };
  const repository = {
    init: function () { }
  };

  it("sets logger to .logger property", () => {
    const handler = new ActionPersistenceHandlerBase(logger);
    expect(handler.logger).toBe(logger);
  });

  it("sets repository to .repository property", () => {
    const handler = new ActionPersistenceHandlerBase(logger, repository);
    expect(handler.repository).toBe(repository);
  });

  it("sets logPrefix to square-bracketed constructor name with space suffix", () => {
    const handler = new ActionPersistenceHandlerBase(logger, repository);
    expect(handler.logPrefix).toBe("[ActionPersistenceHandlerBase] ");
  });
});
