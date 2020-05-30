module.exports = class Action {
  constructor(command, data) {
    this.command = command || "";
    this.data = data || "";
  }

  static getAction(message) {
    const action = new Action();
    if (message) {
      let matches = /^!([a-z]+)(?:\s+(.*))?$/gi.exec(message);
      if (matches) {
        action.command = matches[1].trim().toLowerCase();
        if (matches.length > 2 && matches[2]) {
          action.data = matches[2].toString().trim();
        }
      }
    }
    return action;
  }
};
