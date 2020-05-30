const Bot = require("./app/bot");
const fs = require("fs");
console.log("Checking config...");
const config = JSON.parse(fs.readFileSync("config.json"));
if (!config) {
  throw new Error("Config not found or unreadable!");
}
console.log("Config loaded!");

const bot = new Bot(config);
