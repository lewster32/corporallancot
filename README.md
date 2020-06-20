# Corporal Lancot

A dockerised Discord bot written in Node.js, primarily for recording, searching and retrieving notes and quotes from a database. This project currently uses MariaDB as a backing store.

## To Run

* Create a discord application & bot:
  * https://discord.com/developers/applications
  * The bot requests the following permissions:
    * General Permissions: View channels
    * Text Permissions: Send Messages, Embed links, Attach Files, Mention Everyone
    * This results in a permssions integer of 183296
* Create a .env file in the project root:
```
DB_LOCAL_PORT=3306
DB_MOUNT_PATH=<DATABASE_MOUNT_PATH>
DB_SQL_SCRIPTS_MOUNT_PATH=<SCRIPTS_MOUNT_PATH>
BOT_LOGS_MOUNT_PATH=<LOGS_MOUNT_PATH>
MYSQL_ROOT_PASSWORD=<YOUR_ROOT_PW>
MYSQL_USER=notes
MYSQL_PASSWORD=<NOTES_USER_PW>
MYSQL_DATABASE=notes
```
* Where:
  * `<DATABASE_MOUNT_PATH>` is the host machine path where the database files will be persisted. On a Windows host you can use something like `d:/docker-mounts/corporallancot.db`, on a Linux host `/docker-mounts/corporallancot.db`.
  * `<SCRIPTS_MOUNT_PATH>` is the host machine path where any SQL scripts that need to be executed after the container is created are located. See [Initializing a fresh instance on this page](https://hub.docker.com/_/mariadb/) for more information. This is useful for running ETL and / or custom setup scripts for the database. This can be an empty directory and follows the same rules as `<DATABASE_MOUNT_PATH>`. The [.gitignore](.gitignore) file for this project implies that custom database setup scripts should be kept in the `.sql` directory in the root; on Windows the mount path would be something similar to `D:/Git/Personal/corporallancot/.sql`.
  * `<LOGS_MOUNT_PATH>` is the host machine path where the bot logs will be persisted. On a Windows host you can use something like `d:/docker-mounts/corporallancot.bot.logs`, on a Linux host `/docker-mounts/corporallancot.bot.logs`.
  * `<YOUR_ROOT_PW>` is the database's root password. This is for administrative purposes only. The root user is not used by the application.
  * `<NOTES_USER_PW>` is the database's `notes` user password. This is the account that the application uses to connect to the database.

* Create a `config.json` file in the project root with the following contents:
```
{
  "key": "<DISCORD_BOT_TOKEN>",
  "db": "notes",
  "dbTable": "notes",
  "dbHost": "corporallancot.db",
  "dbUser": "notes",
  "dbPassword": "<NOTES_USER_PW>"
}
```
* Where:
  * `<DISCORD_BOT_TOKEN>` is the bot's authorisation token from the Discord Developer Portal
  * `<NOTES_USER_PW>` is the database `notes` user's password
* Install Docker
* Run the following cli command to start the bot:
```
docker-compose up -d
```
* Send a request to invite the bot to your server:
  * `https://discord.com/api/oauth2/authorize?client_id=<YOUR_CLIENT_ID>&scope=bot&permissions=183296`
    * Where:
      * `<YOUR_CLIENT_ID>` is the ID of the Discord application
* Select your server, grant permissions and the bot will join

## Bot Usage
* Use `!notes <message>` to log a message
* Use `!quote` to retrieve a random message from the notes archive
* Use `!quote <search term>` to retrieve a message using a basic search
* Use `!help` to show a help message

## Logging

By default, the bot will log its output to the console, however you can provide the following options inside your `config.json` to configure where and how it logs:

* `logLevel`: log only if the level is less than or equal to this level (default `"info"`)
* `logTimeStampFormat`: the [fecha](https://github.com/taylorhakes/fecha) date format for time stamps on log entries (defaults to [Winston](https://github.com/winstonjs)'s default timestamp format)
* `logTransports`: an array or delimiter separated list of desired transports; currently supports `console`, `file` and `rolling` (default `["console"]`)
* `logPath`: the directory to output log files to (default `"./logs"`, requires `file` or `rolling` transport)
* `logFileName`: the name of the file - including `%DATE%` will insert the rolling date into that location (if not specified, and a `rolling` transport is specified, the date will be appended to the filename) (default `"./bot.log"`, requires `file` or `rolling` transport)
* `logDailyRotateDatePattern`: the [Moment.js](https://momentjs.com/) date format for including in file names - also specifies the frequency of log rotations via the granularity of the date format (default `"YYYY-MM-DD"`, requires `rolling` transport)
* `logDailyRotateFrequency`: overrides `logDailyRotateDatePattern` to specify a particular timed rotation in `#h` or `#m` format (e.g., '5m' or '3h') (default `null`, requires `rolling` transport)
* `logDailyRotateMaxFiles`: the maximum number of logs to keep - this can be a number for the number of files, or a string in the format `#d` for a total number of days' worth of logs (default `null`, requires `rolling` transport)
* `logDailyRotateMaxSize`: the maximum size of the file after which it will rotate - this can be a number of bytes, or units of kb, mb, and gb - if using the units, add `k`, `m`, or `g` as the suffix (the units need to directly follow the number) (default `null`, requires `rolling` transport)
* `logDailyRotateZipped`: whether or not to gzip archived log files (default `false`, requires `rolling` transport)
