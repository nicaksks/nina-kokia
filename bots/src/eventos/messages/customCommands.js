const client = require('../..');
const db = require('quick.db');
const config = require('../../../src/util/config');
const customPrefix = config['nina'][0].customPrefix;

client.on('messageCreate', async message => {

    var banAPI = new db.table('banAPI');
    const consulta = banAPI.fetch(`banAPI_${message.author.id}`);
    const search = banAPI.fetch(`banAPI_${message.author.id}`);
    const bannedBy = banAPI.all().filter(data => data.ID);

	var cadastro = new db.table('cadastro');
    const avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=2048`
    await cadastro.set(`${message.author.id}`, { id: message.author.id, name: message.author.username, hastag: message.author.username + "#" + message.author.discriminator, avatar: avatar });
    
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    if (!message.content.toLowerCase().startsWith(customPrefix.toLowerCase())) return;
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;
	if (consulta) return message.reply(`Você está **banido(a)** de usar qualquer comando da **nina** \nMotivo do seu banimento: **${search.motivo}** \nDuração do seu banimento: **${search.duration}.**`);
    
    //Banco de dados;
    var cc = new db.table('customCommands'); 

    const args = message.content.trim().slice(customPrefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    const customCommand = cc.fetch(command)

    try {
        message.reply(customCommand.description);
    } catch (err) {
        //message.channel.send(`O comando custom **${customPrefix}${command}** não existe.`);
        console.error('[customCommands] - ' + err);
    }

    //Lista com os comandos;
    const searchCommands = cc.all().filter(data => data.ID);

    let allCommands = "";

    for (let i=0; i < searchCommands.length; ++i) {
        allCommands += searchCommands[i]['ID'] + ", "
    }

    if(message.content === `${customPrefix}comandos`)

        if(searchCommands >= 0) {
            return message.reply(`**nina** não conseguiu encontrar nenhum comando. \nSeja a primeira pessoa a criar um comando novo para **nina**.`);
        } else {
            return message.reply(`Lista com os comandos da comunidade. \n${allCommands}`);
        }
})