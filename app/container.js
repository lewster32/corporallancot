'use strict';

// Container
const ioc = require('awilix');
const Lifetime = ioc.Lifetime;

// App
const Bot = require('@root/bot');
// Services
const DbConfig = require('@services/db/dbConfig');
const DbAdapter = require('@services/db/mariaDbAdapter');
const Config = require('@services/appConfig/appConfig');
const Logger = require('@services/logging/logger');
// Actions
const HelpActionHandler = require("@actions/handlers/helpActionHandler");
const NotesActionHandler = require("@actions/handlers/notesActionHandler");
const QuoteActionHandler = require("@actions/handlers/quoteActionHandler");
// Action Persistence Handlers
const NotesActionPersistenceHandler = require("@actions/persistenceHandlers/notesActionPersistenceHandler");
// 3rd party
const MySQL = require("mysql2/promise");
const Discord = require("discord.js");

// IoC container - these are the only references to console.log() that should exist in the application
console.log("Creating IoC container");
const container = ioc.createContainer({
  injectionMode: ioc.InjectionMode.PROXY
})
console.log("Registering services");

container.register({
  bot: ioc.asClass(Bot, { lifetime: Lifetime.SINGLETON }),
  configFilePath: ioc.asValue("config.json"),
  dbConfig: ioc.asClass(DbConfig),
  dbAdapter: ioc.asClass(DbAdapter, { lifetime: Lifetime.SINGLETON }),
  appConfig: ioc.asFunction(Config),
  logger: ioc.asClass(Logger),
  mySql: ioc.asValue(MySQL),
  discord: ioc.asValue(Discord),
  botVersion: ioc.asValue(process.env.npm_package_version),
  botName: ioc.asValue(process.env.npm_package_name),
  botDescription: ioc.asValue(process.env.npm_package_description),

  // Register Action persistence handlers - TODO: Register automatically
  notesActionPersistenceHandler: ioc.asClass(NotesActionPersistenceHandler, { lifetime: Lifetime.SINGLETON }),

  // Register Actions - TODO: Register automatically
  helpAction: ioc.asClass(HelpActionHandler),
  notesAction: ioc.asClass(NotesActionHandler),
  quoteAction: ioc.asClass(QuoteActionHandler),

  // Add all of the above actions into the below returned array
  helpActionActions: ioc.asFunction(function () {
    return [
      container.cradle.notesAction,
      container.cradle.quoteAction
    ];
  }, { lifetime: Lifetime.SINGLETON }),
  // Also include the help action. Do not inject this registration into any actions as you will create a cyclic dependency
  actions: ioc.asFunction(function () {
    return container.cradle.helpActionActions
      .concat([container.cradle.helpAction]);
  }, { lifetime: Lifetime.SINGLETON })
});
container.cradle.logger.log("All services registered");

module.exports = container;
