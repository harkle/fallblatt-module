const colors = require('colors');
const vorpal = require('vorpal')();
const fs = require('fs');
const ModuleController = require('./ModuleController');

module.exports = class Module extends ModuleController {
  constructor(address) {
    super(address, 0);

    this.loadMessagesMapping();
  }

  loadMessagesMapping() {
    this.messages = require('../config/modules-mapping/' + this.address + '.json');

    this.bladeCount = this.messages.length;
  }

  //TODO get current message
  //TODO
  list() {
    this.messages.forEach(function(message, index) {
      //if (message.trim().length > 0) console.log("\x1b[35m" + index + "\t" + message + "\x1b[0m");
    });
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
        break;
      case 'stop':
        clearTimeout(this.randomTimeout);
        break;
    }
  }

  selectRandomPosition() {
    this.randomTimeout = setTimeout(() => {
      let index = this.findRandomMessage();
      this.move(index);

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
