const dbConnect = require('../src/sql/dbConnect.js');
const { nina } = require('../src/util/config.json');
const tmi = require('tmi.js');
const fs = require('fs');
const Enmap = require('enmap');
const customCommands = require('../src/schemas/commands.js');
const count = require('../src/schemas/count.js');

const client = new tmi.Client({
  identity: {
    username: nina.name,
    password: nina.token
  },
  channels: nina.canais
});

//Raid
client.on("raided", (channel, username, viewers) => {
  client.say(channel, `Obrigada pela raid ${username} o/ \nVisitem o canal twitch.tv/${username} e deixe um followzão p ajudar ele(a) Prayge`);
});

//Bits
client.on("cheer", (channel, userstate, message) => {
  client.say(channel, `${userstate["display-name"]}, obrigada pelos ${userstate["bits"]} brigadeiro(s) o/`);
});

//Sub
client.on("subscription", (channel, username, method, message, userstate) => {
  client.say(channel, `${userstate["display-name"]}, obrigada sub! Entre no nosso !discord para receber uns benefícios!`);
});

//Resub
client.on("resub", (channel, username, months, message, userstate, methods) => {
  client.say(channel, `${userstate["display-name"]}, obrigada pelo resub!`);
});

//customCommands;
client.on("message", async (channel, tags, message, self) => {

  if(self) return;

  let command = await customCommands.findOne({ name: message.toLowerCase() })
  if(!command) return;

  let contagem = "";
  try {
    contagem = await count.findOne({ name: message.toLowerCase() }) || "";
  } catch (e) {
    //console.log({})
  }

  const regex = command.name.indexOf("(_count_)");

  if(regex) {
    try {
      client.say(channel, command.description.replace("(_count_)", contagem.commandCount += 1));
      contagem.save()
    } catch (e) {
      //console.log({})
    }
  } else {
    return client.say(channel, command.description);
  }
});

//Ler eventos.
fs.readdir('./kokia/src/eventos', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./eventos/${file}`);
    let eventName = file.split('.')[0];
    let messageName = file.split('.');
    client.on(eventName, event.bind(null, client));
  });
});

//Ler comandos.
client.commands = new Enmap();
fs.readdir('./kokia/src/comandos', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    let props = require(`./comandos/${file}`);
    let commandName = file.split('.')[0];
    client.commands.set(commandName, props);
  });
});

dbConnect();
client.connect();