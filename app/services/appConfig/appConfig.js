'use strict';

const fs = require("fs");

module.exports = ({ configFilePath }) => {
  const config = JSON.parse(fs.readFileSync(configFilePath));
  return config;
}
