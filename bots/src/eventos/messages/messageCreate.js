const client = require('../..');
const config = require('../../util/config');
const db = require('quick.db');
const prefix = config['nina'][0].prefix;

client.on('messageCreate', async (message) => {

    var banAPI = new db.table('banAPI');
    const consulta = banAPI.fetch(`banAPI_${message.author.id}`);
    const search = banAPI.fetch(`banAPI_${message.author.id}`);
    const bannedBy = banAPI.all().filter(data => data.ID);

	var cadastro = new db.table('cadastro');
    const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=2048`
    await cadastro.set(`${message.author.id}`, { id: message.author.id, name: message.author.username, hastag: message.author.username + "#" + message.author.discriminator, avatar: avatar });
    
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;
    if (consulta) return message.reply(`Você está **banido(a)** de usar qualquer comando * da **nina** \nMotivo do seu banimento: **${search.motivo}** \nDuração do seu banimento: **${search.duration}.**`);
    const args = message.content.trim().slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`../../../src/comandos/prefix/${command}.js`)
        commandFile.run(client, message, args);
    } catch (err) {
    //console.error('Erro:' + err);
  }
})