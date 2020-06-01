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
DB_MOUNT_PATH=<YOUR_MOUNT_PATH>
MYSQL_ROOT_PASSWORD=<YOUR_ROOT_PW>
MYSQL_USER=notes
MYSQL_PASSWORD=<NOTES_USER_PW>
MYSQL_DATABASE=notes
```
* Where:
  * `<YOUR_MOUNT_PATH>` is the host machine path where the database files will be persisted. On a Windows host you can use something like `d:/docker-mounts/corporallancot.db`, on a Linux host `/docker-mounts/corporallancot.db`.
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
