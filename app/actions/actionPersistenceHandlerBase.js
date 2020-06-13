'use strict';

module.exports = class ActionPersistenceHandlerBase {
  constructor(logger, repository) {
    this.logger = logger;
    this.repository = repository;
    this.logPrefix = `[${this.constructor.name}] `;

    this.logger.log(`${this.logPrefix}Initialising action persistence handler`);
  }
};
