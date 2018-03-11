const Module = require('./inc/ModuleController');

let modules = [new Module(0x34), new Module(0x35)];

Module.reset();

let randomTimeout;

function random(action) {
  switch (action) {
    case 'start':
      selectRandomPosition();
      console.log("\x1b[35m" + 'Random mode started' + "\x1b[0m");
      break;
    case 'stop':
      clearTimeout(randomTimeout);
      console.log("\x1b[35m" + 'Random mode stopped' + "\x1b[0m");
      break;
  }
}

function selectRandomPosition() {
  randomTimeout = setTimeout(function() {
    var address = (Math.floor(Math.random() * 2) == 0) ? 52 : 53;
    let index = findRandomMessage(address);
    move(address, index);

    selectRandomPosition();
  }, 3000 + Math.floor(Math.random() * 10000));
}

function getModule(address) {
  let destinationModule;

  modules.forEach(function(module, index) {
    if (module.address == address) {
      destinationModule =  module;
    }
  });

  return destinationModule;
}

function findRandomMessage(address) {
  let isEmpty = true;
  let index = Math.floor(Math.random() * getModule(address).messages.length);

  while(isEmpty) {
    var message = getModule(address).messages[index].trim();

    if (message) {
      isEmpty = false;
    } else {
      index = Math.floor(Math.random() * getModule(address).messages.length);
    }
  }

  return index
}

function move(address, position) {
  getModule(address).position(position);
  console.log("\x1b[35m" + 'Module "' + address + '" moved to position "' + position + '"' + "\x1b[0m");
}

var stdin = process.openStdin();
stdin.addListener('data', function(data) {
  data = data.toString().trim();
  data = data.split(' ');

  switch (data[0]) {
    case 'reset' :
      Module.reset();
      console.log("\x1b[35m" + 'All modules set to position 0' + "\x1b[0m");
      break;
    case 'move' :
      if (data[1] && data[2]) {
        move(data[1], data[2]);
      } else {
        process.stdout.write('usage: ');
        help('move');
      }
      break;
    case 'random' :
      if (data[1] == 'start' || data[1] == 'stop') {
        random(data[1]);
      } else {
        process.stdout.write('usage: ');
        help('random');
      }
      break;
    default:
      console.log('command not found');
      help();
    break;
  }

  process.stdout.write('> ');
});

var commands = [
  {
    name: 'reset',
    data: 'reset\t\t\treset all the modules to 0 position'
  },
  {
    name: 'move',
    data: 'move <ADDR> <POS>\tMove module <ADDR> to position <POS>'
  },
  {
    name: 'random',
    data: 'random -start|-stop\tPlay in random mode'
  }
];

function help(target) {
  commands.forEach(function(command, index) {
    if (!target || command.name == target) {
      console.log(command.data);
    }
  });
}

process.stdout.write('> ');
