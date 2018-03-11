const fs = require('fs');
const UARTController = require('./UARTController');

module.exports = class ModuleController extends UARTController {
  constructor(address) {
    super();

    this.address = address;
  }

  static reset() {
    let data = new Buffer([0xFF, 0xC5, this.address]);
    UARTController.send(data);
  }

  step() {
    let data = new Buffer([0xFF, 0xC7, this.address]);
    UARTController.send(data);
  }

  move(index) {
    if (!index) {
      let data = new Buffer([0xFF, 0xD0, this.address]);
      UARTController.send(data);
    } else {
      let data = new Buffer([0xFF, 0xC0, this.address, index]);
      UARTController.send(data);
    }
  }
};
