const fs = require('fs');
const Module = require('./inc/ModuleController');

let moduleInstance;

fs.readFile('./config/module.txt', 'utf8', (err, contents) => {
  let data = contents.split("\n");

  moduleInstance = new Module(data[0])
  Module.reset();
});




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
    let index = findRandomMessage();
    move(index);

    selectRandomPosition();
  }, 3000 + Math.floor(Math.random() * 10000));
}

function findRandomMessage() {
  let isEmpty = true;
  let index = Math.floor(Math.random() * moduleInstance.messages.length);

  while(isEmpty) {
    var message = moduleInstance.messages[index].trim();

    if (message) {
      isEmpty = false;
    } else {
      index = Math.floor(Math.random() * moduleInstance.messages.length);
    }
  }

  return index
}

function list() {
  moduleInstance.messages.forEach(function(message, index) {
    if (message.trim().length > 0) console.log("\x1b[35m" + index + "\t" + message + "\x1b[0m");
  });
}

function find(target) {
  var found = false;
  var messageIndex = 0;

  moduleInstance.messages.forEach(function(message, index) {
    if (message.toLowerCase().search(target.toLowerCase()) > -1 && !found) {
      messageIndex = index;
      found = true;
    }
  });

  if (found) move(messageIndex);
}

function move(position) {
  moduleInstance.position(position);
  console.log("\x1b[35m" + 'Module moved to position "' + position + '"' + "\x1b[0m");
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
    case 'list' :
      list();
      break;
    case 'find' :
      if (data[1]) {
        find(data[1]);
      } else {
        process.stdout.write('usage: ');
        help('find');
      }
      break;
    case 'move' :
      if (data[1]) {
        move(data[1]);
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
    name: 'list',
    data: 'list\t\t\tList all messages'
  },
  {
    name: 'find',
    data: 'find <STRING>\t\tMove module to position <STRING>'
  },
  {
    name: 'move',
    data: 'move <POS>\t\tMove module to position <POS>'
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
