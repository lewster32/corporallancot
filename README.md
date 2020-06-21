# Corporal Lancot

![License](https://img.shields.io/github/license/lewster32/corporallancot)
![Version](https://img.shields.io/github/package-json/v/lewster32/corporallancot)
![CI Build](https://img.shields.io/github/workflow/status/lewster32/corporallancot/Corporal%20Lancot%20CI%20Build?label=CI%20Build)
![CD Build](https://img.shields.io/github/workflow/status/lewster32/corporallancot/Corporal%20Lancot%20CD%20Build?label=CD%20Build)
![Issues Open](https://img.shields.io/github/issues/lewster32/corporallancot)
![PRs Open](https://img.shields.io/github/issues-pr/lewster32/corporallancot)
![Last Commit](https://img.shields.io/github/last-commit/lewster32/corporallancot)

A containerised Discord bot written in Node.js, primarily for recording, searching and retrieving notes and quotes from a database. This project currently uses MariaDB as a backing store.

## To Run

* Create a discord application & bot:
  * https://discord.com/developers/applications
  * The bot requests the following permissions:
    * General Permissions: View channels
    * Text Permissions: Send Messages, Embed links, Attach Files, Mention Everyone
    * This results in a permssions integer of 183296
* Create a .env file in the project root:
```
BOT_DISCORD_KEY=<YOUR_DISCORD_TOKEN>
BOT_DB_LOCAL_PORT=3306
BOT_DB_SERVER=corporallancot.db
BOT_DB_MOUNT_PATH=<DATABASE_MOUNT_PATH>
BOT_DB_SQL_SCRIPTS_MOUNT_PATH=<SCRIPTS_MOUNT_PATH>
MYSQL_ROOT_PASSWORD=<YOUR_ROOT_PW>
MYSQL_USER=notes
MYSQL_PASSWORD=<NOTES_USER_PW>
MYSQL_DATABASE=notes
```
* Where:
  * `<YOUR_DISCORD_TOKEN>` is the token for your discord bot.
  * `<DATABASE_MOUNT_PATH>` is the host machine path where the database files will be persisted. On a Windows host you can use something like `d:/docker-mounts/corporallancot.db`, on a Linux host `/docker-mounts/corporallancot.db`.
  * `<SCRIPTS_MOUNT_PATH>` is the host machine path where any SQL scripts that need to be executed after the container is created are located. See [Initializing a fresh instance on this page](https://hub.docker.com/_/mariadb/) for more information. This is useful for running ETL and / or custom setup scripts for the database. This can be an empty directory and follows the same rules as `<DATABASE_MOUNT_PATH>`. The [.gitignore](.gitignore) file for this project implies that custom database setup scripts should be kept in the `.sql` directory in the root; on Windows the mount path would be something similar to `D:/Git/Personal/corporallancot/.sql`.
  * `<YOUR_ROOT_PW>` is the database's root password. This is for administrative purposes only. The root user is not used by the application.
  * `<NOTES_USER_PW>` is the database's `notes` user password. This is the account that the application uses to connect to the database.
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

_**Do not push sensitive information to the repo in config.json**_

## Bot Usage
* Use `!notes <message>` to log a message
* Use `!quote` to retrieve a random message from the notes archive
* Use `!quote <search term>` to retrieve a message using a basic search
* Use `!help` to show a help message
