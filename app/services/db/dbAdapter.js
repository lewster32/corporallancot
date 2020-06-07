'use strict';

const NotImplemented = require("@errors/notImplemented");

// "Abstract" base class for database injection
module.exports = class DbAdapter {
  constructor(dbConfig, logger) {
    this.logger = logger;
    this.dbConfig = dbConfig;
  }

  async connect() {
    throw NotImplemented;
  }

  async execute(...params) {
    throw NotImplemented;
  }

  async create(...params) {
    throw NotImplemented;
  }

  async read(...params) {
    throw NotImplemented;
  }

  async update(...params) {
    throw NotImplemented;
  }

  async delete(...params) {
    throw NotImplemented;
  }
}
