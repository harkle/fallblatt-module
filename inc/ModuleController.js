const fs = require('fs');
const UARTController = require('./UARTController');

module.exports = class ModuleController extends UARTController {
  constructor(address, bladeCount) {
    super();

    this.position = 0;
    this.address = address;
    this.bladeCount = bladeCount;
  }

  reset() {
    this.position = 0;

    let data = new Buffer([0xFF, 0xC5, this.address]);
    UARTController.send(data);
  }

  step() {
    this.position++;

    if (this.position > this.bladeCount) this.position = 0;

    let data = new Buffer([0xFF, 0xC7, this.address]);
    UARTController.send(data);
  }

  move(index) {
    if (index > this.bladeCount) return;

    this.position = index;

    let data = new Buffer([0xFF, 0xC0, this.address, index]);
    UARTController.send(data);
  }
};
