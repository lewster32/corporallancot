'use strict';

module.exports = class ActionPersistenceHandlerBase {
  constructor(logger, repository) {
    this.logger = logger;
    this.repository = repository;
  }
};
