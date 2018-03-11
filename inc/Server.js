const express = require('express');
const colors = require('colors');
const vorpal = require('vorpal')();
const Actions = require('./Actions');

module.exports = class Server {

  constructor() {
    this.server = express();

    this.server.get('/', function (req, res) {
      res.send('hello world')
    });

    this.server.get('/message', function (req, res) {
      res.send('Message: ' + Actions.message(false));
    });

    this.server.get('/list', function (req, res) {
      res.send('Messages: ' + Actions.list(false));
    });

    this.server.get('/position', function (req, res) {
      res.send('Position: ' + Actions.position());
    });

    this.server.get('/reset', function (req, res) {
      Actions.reset();
      res.send('hello world')
    });

    this.server.get('/move/*', function (req, res) {
      let request = req.url.split('/');
      Actions.move(request[2]);
      res.send('hello world')
    });

    this.server.get('/step', function (req, res) {
      Actions.step();
      res.send('hello world')
    });

    this.server.get('/find/*', function (req, res) {
      let request = req.url.split('/');

      Actions.find(request[2]);
      res.send('hello world')
    });

    this.server.get('/random/*', function (req, res) {
      let request = req.url.split('/');

      Actions.random(request[2]);
      res.send('hello world')
    });

    this.server.listen(3000, function (connection) {
      require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    	  vorpal.log(colors.green('frontend is ready: http://'+add+':3000 or http://127.0.0.1:3000'));
      });
    });
  }
}
