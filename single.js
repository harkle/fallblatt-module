const colors = require('colors');
const vorpal = require('vorpal')();
const Module = require('./inc/Module');

let moduleInstance;

let config = require('./config/config.json');

moduleInstance = new Module(config.module);

Module.connectionPromise.then(function() {
  Module.reset();
});

vorpal
  .command('reset')
  .description('reset module position')
  .action(function(args, callback) {
    Module.reset();
    vorpal.log(colors.magenta('module set to position 0'));
    callback();
  })

vorpal
  .command('list')
  .description('get module messages')
  .action(function(args, callback) {
    moduleInstance.list();
    vorpal.log(colors.magenta('list'));
    callback();
  })

vorpal
  .command('find <string>')
  .description('move the module to searched <string>')
  .action(function(args, callback) {
    moduleInstance.find(args.string);
    vorpal.log(colors.magenta('module moved to "' + args.string + '"'));
    callback();
  })

vorpal
  .command('move <position>')
  .description('move the module to <position>')
  .action(function(args, callback) {
    moduleInstance.move(args.position);
    vorpal.log(colors.magenta('module moved to "' + args.position + '"'));
    callback();
  })

vorpal
  .command('random <action>')
  .description('random mode, use with start|stop')
  .action(function(args, callback) {
    moduleInstance.random(args.action);
    vorpal.log(colors.magenta('random mode set to "' + args.action + '"'));
    callback();
  });

vorpal.delimiter('fallblatt >');
vorpal.show();
