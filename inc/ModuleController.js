const fs = require('fs');
const UARTController = require('./UARTController');

module.exports = class ModuleController extends UARTController {
  constructor(address) {
    super();

    this.address = address;
    this.messages = [];
    this.loadMessagesMapping();
  }

  static reset() {
    let data = new Buffer([0xFF, 0xC5, this.address]);
    UARTController.send(data);
  }

  loadMessagesMapping() {
    fs.readFile('./config/modules-mapping/' + this.address + '.txt', 'utf8', (err, contents) => {
      let data = contents.split("\n");

      data.forEach((value, index) => {
        this.messages[index] = value;
      });
    });
  }

  step() {
    let data = new Buffer([0xFF, 0xC7, this.address]);
    UARTController.send(data);
  }

  position(index) {
    if (!index) {
      let data = new Buffer([0xFF, 0xD0, this.address]);
      UARTController.send(data);
    } else {
      let data = new Buffer([0xFF, 0xC0, this.address, index]);
      UARTController.send(data);
      //console.log("\x1b[35m" + 'Module "' + this.address + '" set to "' + this.messages[index] + '"'+ "\x1b[0m");
    }
  }
};
