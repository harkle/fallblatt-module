const fs = require('fs');
const SerialPort = require('serialport');

module.exports = class UARTController {
  constructor() {
    UARTController.connect();
  }

  static connect() {
    if (this.isConnecting) return;

    this.commandList = [];
    this.isConnecting = true;

    fs.readFile('./config/serial.txt', 'utf8', (err, contents) => {
      let data = contents.split("\n");

      ;
      this.port = new SerialPort(data[0], {
        baudRate: 19200
      });

      this.isConnected = true;
      console.log('Connected');
    });

    setInterval(() => {
      if (this.commandList.length > 0 && this.isConnected) {
        let command = this.commandList.shift();

        UARTController.break().then(() => {
          UARTController.port.write(command, function (err) { });
        });
      }
    }, 500)
  }

  static break() {
    return new Promise((resolve, reject) => {
      UARTController.port.set({brk: true}, () => {
        setTimeout(() => {
          UARTController.port.set({brk: false}, () => {
            resolve();
          });
        }, 50);
      });
    });
  }

  static send(data) {
    this.commandList.push(data);
  }
};
