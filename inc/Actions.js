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

  static reset() {
    this.moduleInstance.reset();
    vorpal.log(colors.magenta('module set to position 0'));
  }

  static position() {
    vorpal.log(colors.magenta('module position is: ' + this.moduleInstance.position));

    return this.moduleInstance.position;
  }

  static list() {
    this.moduleInstance.list();
    vorpal.log(colors.magenta('list'));
  }

  static find(string) {
    this.moduleInstance.find(string);
    vorpal.log(colors.magenta('module moved to "' + string + '"'));
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
