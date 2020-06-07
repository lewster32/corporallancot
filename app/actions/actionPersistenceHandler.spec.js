'use strict';

const ActionPersistenceHandler = require("./actionPersistenceHandler");
const NotImplemented = require("@errors/notImplemented");

describe("actionPersistenceHandler", () => {
  it("sets logger to logger property", () => {
    const logger = {};
    const handler = new ActionPersistenceHandler(logger);
    expect(handler.logger).toBe(logger);
  });

  it("sets actionHandler to actionHandler property", () => {
    const actionHandler = {};
    const handler = new ActionPersistenceHandler({}, actionHandler);
    expect(handler.actionHandler).toBe(actionHandler);
  });

  it("sets db to db property", () => {
    const db = {};
    const handler = new ActionPersistenceHandler({}, {}, db);
    expect(handler.db).toBe(db);
  });

  it("init() throws Not Implemented error (must be overridden)", async () => {
    const handler = new ActionPersistenceHandler({}, {}, {});
    await expectAsync(handler.init())
      .toBeRejectedWith(NotImplemented);
  });
});

