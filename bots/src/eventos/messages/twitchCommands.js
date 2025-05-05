const client = require('../..');
const config = require('../../util/config');
const customCommands = require('../../../kokia/src/schemas/commands.js');
const count = require('../../../kokia/src/schemas/count.js');
const db = require('quick.db');

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
    if (!message.content.toLowerCase().startsWith("-")) return;
    if (consulta) return message.reply(`Você está **banido(a)** de usar qualquer comando da **nina** \nMotivo do seu banimento: **${search.motivo}** \nDuração do seu banimento: **${search.duration}.**`);
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const mensagem = message.content.slice(1).toLowerCase();
	const all = await customCommands.distinct('name');
    if(all.length === 0) return message.reply('Atualmente não tem nenhum comando cadastrado no banco de dados.');
    
    if(mensagem === "comandos") {
        let commands = "";

        for(i in all) {
            commands += "-" + all[i].slice(1) + ", ";
        };
        return message.reply(commands);
    };

    let command = await customCommands.findOne({ name: "!" + mensagem });
    if(!command) return;

    let contagem = await count.findOne({ name: "!" + mensagem });

    if(!contagem) {
        return message.reply(command.description);
    } else {
        message.reply(command.description.replace("(_count_)", contagem.commandCount += 1));
        contagem.save();
    };
});