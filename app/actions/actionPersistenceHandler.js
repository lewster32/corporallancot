const NotImplemented = require("@errors/notImplemented");

module.exports = class ActionPersistenceHandler {
  constructor(logger, dbAdapter) {
    this.logger = logger;
    this.dbAdapter = dbAdapter;
    this.logger.log(`Initialising '${this.constructor.name}' action persistence handler`);
  }

  async init() {
    throw NotImplemented;
  }
};
