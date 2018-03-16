const colors = require('colors');
const vorpal = require('vorpal')();
const fs = require('fs');
const ModuleController = require('./moduleController');

module.exports = class Module extends ModuleController {
  constructor(address, type) {
    super(address, 0);

    this.type = type;
    this.switchMode('static');
    this.loadMessagesMapping();
  }

  loadMessagesMapping() {
    this.messages = require('../config/modules-mapping/' + this.address + '.json');

    this.bladeCount = this.messages.length;
  }

  switchMode(mode) {
    this.mode = mode;

    global.server.io.emit('mode', {mode: this.mode});
  }

  message() {
    return this.messages[this.position];
  }

  list() {
    return this.messages;
  }

  find(target) {
    var found = false;
    var messageIndex = 0;

    this.random('stop');

    this.messages.forEach(function(message, index) {
      if (message.toLowerCase().search(target.toLowerCase()) > -1 && !found) {
        messageIndex = index;
        found = true;
      }
    });

    if (found) this.move(messageIndex);

    return found;
  }

  move(position) {
    this.random('stop');
    super.move(position);
  }

  random(action) {
    switch (action) {
      case 'start':
        clearTimeout(this.randomTimeout);
        this.selectRandomPosition();
        this.switchMode('random');
        break;
      case 'stop':
        clearTimeout(this.randomTimeout);
        this.switchMode('static');
        break;
    }
  }

  selectRandomPosition() {
    this.randomTimeout = setTimeout(() => {
      let index = this.findRandomMessage();
      super.move(index);

      this.selectRandomPosition();
    }, 3000 + Math.floor(Math.random() * 10000));
  }

  findRandomMessage() {
    let isEmpty = true;
    let index = Math.floor(Math.random() * this.messages.length);

    while(isEmpty) {
      var message = this.messages[index].trim();

      if (message) {
        isEmpty = false;
      } else {
        index = Math.floor(Math.random() * this.messages.length);
      }
    }

    return index;
  }
};
