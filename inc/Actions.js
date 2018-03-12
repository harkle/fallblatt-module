const colors = require('colors');
const Module = require('./Module');
const vorpal = require('vorpal')();

module.exports = class Actions {

  constructor() { }

  static init() {
    let config = require('../config/config.json');

    this.moduleInstance = new Module(config.module);

    Module.connectionPromise.then(() => {
      this.moduleInstance.reset();
    });
  }

  static status(serverStatus) {
    let status = {
      serial: Module.status(),
      network: serverStatus,
      mode: this.moduleInstance.mode,
      position: this.moduleInstance.position,
      address: this.moduleInstance.address
    };

    vorpal.log(colors.magenta('serial is: "' + status.serial + '", network is: "' + status.network + '", mode is: "' + status.mode + '"'));

    return status;
  }

  static reset() {
    this.moduleInstance.reset();
    vorpal.log(colors.magenta('module set to position 0'));
  }

  static position() {
    vorpal.log(colors.magenta('module position is: ' + this.moduleInstance.position));

    return this.moduleInstance.position;
  }

  static message(echo = true) {
    let message = this.moduleInstance.message();

    if (echo) {
      vorpal.log(colors.magenta('current message is: "' + message +'"'));
    } else {
      return message;
    }
  }

  static list(echo = true) {
    let messages = this.moduleInstance.list();

    if (echo) {
      messages.forEach(function(message, index) {
        if (message) vorpal.log(colors.magenta(index + "\t\t" + message));
      });
    } else {
      return messages;
    }
  }

  static find(string) {
    let found = this.moduleInstance.find(string);

    if (found) {
      vorpal.log(colors.magenta('module moved to "' + string + '"'));
    } else {
      vorpal.log(colors.red('no message containing "' + string + '" found'));
    }

    return found;
  }

  static move(position) {
    this.moduleInstance.move(position);

    vorpal.log(colors.magenta('module moved to "' + position + '"'));
  }

  static step() {
    this.moduleInstance.step();

    vorpal.log(colors.magenta('module moved 1 step ahead'));
  }

  static random(action) {
    this.moduleInstance.random(action);

    vorpal.log(colors.magenta('random mode set to "' + action + '"'));
  }
}
