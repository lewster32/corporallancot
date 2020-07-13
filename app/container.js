'use strict';

// Container
const ioc = require('awilix');
const Lifetime = ioc.Lifetime;

// App
const Bot = require('@services/bot/bot');

// Config
const AppConfig = require('@config/app/appConfig');
const BotConfig = require('@config/bot/botConfig');
const DbConfig = require('@config/db/dbConfig');

// Services
const DbAdapter = require('@dbAdapters/mariaDb/mariaDbAdapter');
const Logger = require('@services/logging/logger');

// Resolvers
const ActionHandlerResolver = require("@actionHandlers/actionHandlerResolver");

// 3rd party
const MySQL = require("mysql2/promise");
const Discord = require("discord.js");

// IoC container - these are the only references to console.log() that should exist in the application
console.log("[Root] Creating IoC container");

const container = ioc.createContainer({
  injectionMode: ioc.InjectionMode.PROXY
});

console.log("[Root] Registering services");

// Auto load actions & persistence handlers
const actionHandlersGlob = 'app/actionHandlers/*/*ActionHandler.js';
const actionPersistenceHandlersGlob = 'app/actionPersistenceHandlers/*/*ActionPersistenceHandler.js';
const chatListenersGlobSuffix = 'app/chatListeners/*/';
const repositoriesGlob = 'app/services/db/repositories/*/*Repository.js';

container.loadModules([actionHandlersGlob, actionPersistenceHandlersGlob], {
  resolverOptions: {
    register: ioc.asClass
  }
});

// Auto load chat listener files
container.loadModules([
  `${chatListenersGlobSuffix}*ChatListener.js`,
  `${chatListenersGlobSuffix}*ChatListenerConfig.js`,
  `${chatListenersGlobSuffix}*MessageResolver.js`
], {
  resolverOptions: {
    register: ioc.asClass
  }
});

// Auto load repositories (singletons)
container.loadModules([repositoriesGlob], {
  resolverOptions: {
    register: ioc.asClass,
    lifetime: Lifetime.SINGLETON
  }
});

container.register({
  // Bootstrap
  bot: ioc.asClass(Bot).singleton(),

  // Config
  configFilePath: ioc.asValue("config.json"),
  environment: ioc.asValue(process.env),
  appConfig: ioc.asFunction(AppConfig),
  dbConfig: ioc.asClass(DbConfig),
  botConfig: ioc.asClass(BotConfig),

  // Logging
  logger: ioc.asClass(Logger),

  // 3rd Party dependencies
  mySql: ioc.asValue(MySQL),
  discordClient: ioc.asFunction(() => new Discord.Client()),

  // Database adapter. Swap out if you want to implement
  // another database provider.
  dbAdapter: ioc.asClass(DbAdapter).singleton(),

  // Resolvers
  actionHandlerResolver: ioc.asClass(ActionHandlerResolver),

  // Add all of the above actions into the below returned array
  helpActions: ioc.asFunction(() => {
    return ioc
      .listModules(actionHandlersGlob)
      .filter(a => a.name !== 'helpActionHandler')
      .map(a => container.resolve(a.name));
  }),

  // Register all actions as an array.
  // N.B. Do not inject this registration into any actions as you will create a cyclic dependency
  actions: ioc.asFunction(() => {
    return ioc
      .listModules(actionHandlersGlob)
      .map(a => container.resolve(a.name));
  })
});

container.cradle.logger.log("[Root] All services registered");

module.exports = container;
