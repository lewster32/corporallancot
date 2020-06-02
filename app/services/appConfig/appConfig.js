'use strict';

const fs = require("fs");

module.exports = ({ configFilePath }) => {
  const config = JSON.parse(fs.readFileSync(configFilePath));
  if (!config) {
    throw new Error(`Config '${configFilePath}' not found or unreadable`);
  }
  return config;
}
