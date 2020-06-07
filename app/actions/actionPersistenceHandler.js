const NotImplemented = require("@errors/notImplemented");

module.exports = class ActionPersistenceHandler {
  constructor(logger, actionHandler, db) {
    this.logger = logger;
    this.actionHandler = actionHandler;
    this.db = db;
  }

  async init() {
    throw NotImplemented;
  }
};
