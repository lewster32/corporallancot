module.exports = class DiscordMessage {
  constructor(message) {
    if (!message || message.replace(/\s/g, '').length <= 0) {
      throw new Error("'message' is required");
    }

    // Set defaults
    this.command = "";
    this.data = "";

    // Slice up message string to make parameters
    const matches = /^!([a-z]+)(?:\s+(.*))?$/gi.exec(message);
    if (!matches || matches.length <= 0) {
      return;
    }

    this.command = matches[1].toLowerCase();
    if (matches[2]) {
      this.data = matches[2];
    }
  }
};
