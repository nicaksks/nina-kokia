const { Client, Intents, GatewayIntentBits, Discord, Collection, Partials } = require('discord.js');
const client = new Client({ 
    intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessageReactions, 
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const config = require('../src/util/config');
const fs = require('fs');
const token = config['nina'][0].token;
const kokia = require('../kokia/src/index.js');
const anniesemtrema = require('../anniesemtrema/src/index.js');

module.exports = client;

//Eventos
['eventos'].forEach((handler) => {
  require(`./handlers/${handler}`)(client)
});

//Anti Crash
process.on('unhandledRejection', (reason, p) => {
  //console.log(reason, p)
});

process.on("uncaughtException", (err, origin) => {
  //console.log(err, origin)
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err, origin)
});

process.on('multipleResolves', (type, promise, reason) => {
  //console.log(type, promise, reason)
});

//Token
client.login(token);