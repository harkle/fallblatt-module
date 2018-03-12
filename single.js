const vorpal = require('vorpal')();
const Actions = require('./inc/Actions');
const Server = require('./inc/Server');

global.server = new Server();

Actions.init();

vorpal
  .command('status')
  .description('reset module position')
  .action(function(args, callback) {
    Actions.status(server.status());
    callback();
  })

vorpal
  .command('reset')
  .description('reset module position')
  .action(function(args, callback) {
    Actions.reset();
    callback();
  })

vorpal
  .command('message')
  .description('get current message')
  .action(function(args, callback) {
    Actions.message();
    callback();
  })

vorpal
  .command('position')
  .description('get module position')
  .action(function(args, callback) {
    Actions.position();
    callback();
  })

vorpal
  .command('list')
  .description('get module messages')
  .action(function(args, callback) {
    Actions.list();
    callback();
  })

vorpal
  .command('find <string>')
  .description('move the module to searched <string>')
  .action(function(args, callback) {
    Actions.find(args.string)
    callback();
  })

vorpal
  .command('step')
  .description('step the module 1 step ahead')
  .action(function(args, callback) {
    Actions.step()
    callback();
  })

vorpal
  .command('move <position>')
  .description('move the module to <position>')
  .action(function(args, callback) {
    Actions.move(args.position)
    callback();
  })

vorpal
  .command('random <action>')
  .description('random mode, use with start|stop')
  .action(function(args, callback) {
    Actions.random(args.action)
    callback();
  });

vorpal.delimiter('fallblatt >');
vorpal.show();
