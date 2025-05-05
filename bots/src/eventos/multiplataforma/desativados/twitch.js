const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../..');
const config = require('../../../src/util/config.json');
const botName = config['twitch'][0].botName;
const twitchToken = config['twitch'][0].twitchToken;
const tmi = require('tmi.js');

//Bot da Twitch
client.on('ready', () => {

    const twitch = new tmi.Client({ 
        options: { debug: false }, 
        identity: {
            username: botName,
            password: twitchToken
        },
        channels: ['anniesemtrema']
    });

//Kokia enviará a mensagem para a Nina e a Nina enviará para o Discord;
twitch.on("chat", async (channel, tags, message, self) => {

    //Para Kokia não enviar a mensagem para sí mesma;
    if(self) return;

    //Data e conversando para Unix
    const data = new Date(); 
    const timestamp = Math.floor(data.getTime() / 1000);

    //Canal em que a mensagem será enviada;
    let canal = client.channels.cache.get("985932634943283230");
    await canal.send({ content: `💌 **|** __**Recebido**__ **|** <t:${timestamp}:d> **-** **\`${tags['display-name']}\`:** ${message}` })
});

//Nina enviará a mensagem para a Kokia e a Kokia enviará para Twitch;
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.channel.id !== "985932634943283230") return;
    if (message.content.length >= 500) return;

    //Apagar a mensagem enviada;
    message.delete().catch(O_o => {});

    //Data e conversando para Unix
    const data = new Date(); 
    const timestamp = Math.floor(data.getTime() / 1000);

    //Nina enviará a mensagem para a Kokia e a Kokia enviará para Twitch;
    let canal = client.channels.cache.get("985932634943283230");
    await canal.send({ content: `💌 **|** __**Enviado**__ **|** <t:${timestamp}:d> **-** **\`${message.author.username}\`:** ${message.content}` })
    await twitch.say("anniesemtrema", `${message.author.username}: ${message.content}`);
});

twitch.connect();
});