const express = require('express');
const colors = require('colors');
const vorpal = require('vorpal')();
const Actions = require('./Actions');

module.exports = class Server {

  constructor() {
    this.isConnected = false;
    this.server = express();

    this.server.get('/', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({message: 'fallblatt API'}));
    });

    this.server.get('/status', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({message: Actions.status(this.isConnected)}));
    });

    this.server.get('/message', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({message: Actions.message(false)}));
    });

    this.server.get('/list', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(Actions.list(false)));
    });

    this.server.get('/position', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({position: Actions.position()}));
    });

    this.server.post('/reset', function (req, res) {
      Actions.reset();

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({success: true}));
    });

    this.server.post('/move/*', function (req, res) {
      let request = req.url.split('/');
      Actions.move(request[2]);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({success: true}));
    });

    this.server.post('/step', function (req, res) {
      Actions.step();

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({success: true}));
    });

    this.server.post('/find/*', function (req, res) {
      let request = req.url.split('/');

      let found = Actions.find(request[2]);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({success: found}));
    });

    this.server.post('/random/*', function (req, res) {
      let request = req.url.split('/');

      Actions.random(request[2]);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({success: true}));
    });

    this.server.listen(3000, (connection) => {
      require('dns').lookup(require('os').hostname(), (err, add, fam) => {
        if (!err) {
          this.isConnected = true;

          vorpal.log(colors.green('frontend is ready: http://'+add+':3000 or http://127.0.0.1:3000'));
        } else {
          vorpal.log(colors.red(err));
        }
      });
    });
  }

  status() {
    return this.isConnected;
  }
}
