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

// Chat Listener objects - one set per server
const DiscordChatListener = require('@chatListeners/discord/discordChatListener');
const DiscordChatListenerConfig = require('@chatListeners/discord/discordChatListenerConfig');
const DiscordMessageResolver = require("@chatListeners/discord/discordMessageResolver");

// Services
const DbAdapter = require('@dbAdapters/mariaDb/mariaDbAdapter');
const Logger = require('@services/logging/logger');

// Actions
const HelpActionHandler = require("@actionHandlers/help/helpActionHandler");
const NotesActionHandler = require("@actionHandlers/notes/notesActionHandler");
const QuoteActionHandler = require("@actionHandlers/quote/quoteActionHandler");
const GenericActionHandler = require("@actionHandlers/generic/genericActionHandler");

// Resolvers
const ActionHandlerResolver = require("@actionHandlers/actionHandlerResolver");

// Action Persistence Handlers
const NotesActionPersistenceHandler = require("@actionPersistenceHandlers/notes/notesActionPersistenceHandler");

// DB Repositories
const NotesRepository = require("@dbRepositories/notes/notesRepository");

// 3rd party
const MySQL = require("mysql2/promise");
const Discord = require("discord.js");

// IoC container - these are the only references to console.log() that should exist in the application
console.log("[Root] Creating IoC container");
const container = ioc.createContainer({
  injectionMode: ioc.InjectionMode.PROXY
})
console.log("[Root] Registering services");

container.register({
  // Bootstrap
  bot: ioc.asClass(Bot, { lifetime: Lifetime.SINGLETON }),

  // Config
  configFilePath: ioc.asValue("config.json"),
  environment: ioc.asValue(process.env),
  appConfig: ioc.asFunction(AppConfig),
  dbConfig: ioc.asClass(DbConfig),
  botConfig: ioc.asClass(BotConfig),

  // Logging
  logger: ioc.asClass(Logger),

  // 3rd Party
  mySql: ioc.asValue(MySQL),
  discordClient: ioc.asFunction(() => new Discord.Client()),

  // Chat Listener classes
  discordChatListener: ioc.asClass(DiscordChatListener),
  discordChatListenerConfig: ioc.asClass(DiscordChatListenerConfig),
  discordMessageResolver: ioc.asClass(DiscordMessageResolver),

  // Register Action persistence handlers - TODO: Register automatically
  notesActionPersistenceHandler: ioc.asClass(NotesActionPersistenceHandler),

  // Register database and repositories
  dbAdapter: ioc.asClass(DbAdapter, { lifetime: Lifetime.SINGLETON }),

  // TODO: Register repos automatically. Note that these do not need to be singletons.
  notesRepository: ioc.asClass(NotesRepository, { lifetime: Lifetime.SINGLETON }),

  // Register Actions - TODO: Register automatically
  helpAction: ioc.asClass(HelpActionHandler),
  notesAction: ioc.asClass(NotesActionHandler),
  quoteAction: ioc.asClass(QuoteActionHandler),
  genericActionHandler: ioc.asClass(GenericActionHandler),

  // Resolvers
  actionHandlerResolver: ioc.asClass(ActionHandlerResolver),

  // Add all of the above actions into the below returned array
  helpActionActions: ioc.asFunction(() => {
    return [
      container.cradle.notesAction,
      container.cradle.quoteAction,
      container.cradle.genericActionHandler
    ];
  }),
  // Also include the help action. Do not inject this registration into any actions as you will create a cyclic dependency
  actions: ioc.asFunction(() => {
    return container.cradle.helpActionActions
      .concat([container.cradle.helpAction]);
  })
});

// Auto loading
// container.loadModules(['@actionHandlers/*/*ActionHandler.js', 'repositories/**/*.js'], {
//   resolverOptions: {
//     injectionMode: InjectionMode.CLASSIC
//   }
// })

container.cradle.logger.log("[Root] All services registered");

module.exports = container;
