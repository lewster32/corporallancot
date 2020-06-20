'use strict';

// Container
const ioc = require('awilix');
const Lifetime = ioc.Lifetime;

// App
const Bot = require('@root/bot');

// Services
const DbConfig = require('@services/db/dbConfig');
const DbAdapter = require('@dbAdapters/mariaDbAdapter');
const Config = require('@services/appConfig/appConfig');
const Logger = require('@services/logging/logger');
const LoggerConfig = require('@services/logging/loggerConfig');
const LogFormatter = require("@logging/formatters/defaultLogFormatter");

// Actions
const HelpActionHandler = require("@actions/handlers/helpActionHandler");
const NotesActionHandler = require("@actions/handlers/notesActionHandler");
const QuoteActionHandler = require("@actions/handlers/quoteActionHandler");

// Action Persistence Handlers
const NotesActionPersistenceHandler = require("@actions/persistenceHandlers/notesActionPersistenceHandler");

// DB Repositories
const NotesRepository = require("@dbRepositories/notesRepository");

// Node std lib
const Path = require("path");

// 3rd party
const MySQL = require("mysql2/promise");
const Discord = require("discord.js");
const Winston = require("winston");
const WinstonDailyRotateFile = require("winston-daily-rotate-file/daily-rotate-file");

// IoC container - these are the only references to console.log() that should exist in the application
console.log("[Root] Creating IoC container");
const container = ioc.createContainer({
  injectionMode: ioc.InjectionMode.PROXY
})
console.log("[Root] Registering services");

container.register({
  bot: ioc.asClass(Bot, { lifetime: Lifetime.SINGLETON }),
  configFilePath: ioc.asValue("config.json"),
  dbConfig: ioc.asClass(DbConfig),
  appConfig: ioc.asFunction(Config),
  path: ioc.asValue(Path),
  loggerConfig: ioc.asClass(LoggerConfig),
  logFormatter: ioc.asClass(LogFormatter, { lifetime: Lifetime.SINGLETON }),
  logger: ioc.asClass(Logger, { lifetime: Lifetime.SINGLETON }),
  mySql: ioc.asValue(MySQL),
  discord: ioc.asValue(Discord),
  winston: ioc.asValue(Winston),
  winstonDailyRotateFile: ioc.asValue(WinstonDailyRotateFile),
  botVersion: ioc.asValue(process.env.npm_package_version),
  botName: ioc.asValue(process.env.npm_package_name),
  botDescription: ioc.asValue(process.env.npm_package_description),

  // Register Action persistence handlers - TODO: Register automatically
  notesActionPersistenceHandler: ioc.asClass(NotesActionPersistenceHandler, { lifetime: Lifetime.SINGLETON }),

  // Register database and repositories
  dbAdapter: ioc.asClass(DbAdapter, { lifetime: Lifetime.SINGLETON }),
  // TODO: Register repos automatically. Note that these do not need to be singletons.
  notesRepository: ioc.asClass(NotesRepository),

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
container.cradle.logger.log("[Root] All services registered");

module.exports = container;
