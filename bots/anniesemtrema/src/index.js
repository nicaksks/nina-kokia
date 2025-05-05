const { nina } = require('../src/util/config.json');
const tmi = require('tmi.js');
const fs = require('fs');
const Enmap = require('enmap');

const client = new tmi.Client({
  identity: {
    username: nina.name,
    password: nina.token
  },
  channels: nina.canais
});

//Ler eventos.
fs.readdir('./anniesemtrema/src/eventos', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./eventos/${file}`);
    let eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  });
});
client.connect();