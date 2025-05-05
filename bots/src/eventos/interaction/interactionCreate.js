const { Collection} = require('discord.js');
const client = require('../..');
const fs = require('fs');
const db = require('quick.db');

//Executar comando com (/) na pasta comandos.
client.commands = new Collection();
const Slashcommands = fs.readdirSync('./src/comandos/slash').filter(file => file.endsWith('.js'));

for (const file of Slashcommands) {
    const command = require(`../../../src/comandos/slash/${file}`);
    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;    
    client.commands.set(command.data.name, command);
}

//Registar os comandos com (/)
client.on('interactionCreate', async interaction => {
    
    var banAPI = new db.table('banAPI');
    const consulta = banAPI.fetch(`banAPI_${interaction.user.id}`);
    const search = banAPI.fetch(`banAPI_${interaction.user.id}`);
    const bannedBy = banAPI.all().filter(data => data.ID);
    
    var cadastro = new db.table('cadastro');
    const avatar = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp?size=2048`;
    await cadastro.set(`${interaction.user.id}`, { id: interaction.user.id, name: interaction.user.username, hastag: interaction.user.username + "#" + interaction.user.discriminator, avatar: avatar });

    if(consulta) return interaction.reply(`Você está **banido(a)** de usar qualquer comando da **nina** \nMotivo do seu banimento: **${search.motivo}** \nDuração do seu banimento: **${search.duration}.**`);

    if(!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        return interaction.reply({ content: `O comando ${command} não foi possível executar no servidor ${message.guild.name}!`, ephemeral: true });
    }   
});