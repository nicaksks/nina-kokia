const client = require('../..');
var AsciiTable = require('ascii-table');

client.on('ready', () => {

    //Nome dos servidores + ID dos servidores;
    const guildName = client.guilds.cache.map(guild => guild.name);
    const guildId = client.guilds.cache.map(guild => guild.id);

    let lista = "";

    var tabela = new AsciiTable('Servidores')
    tabela.setHeading('', 'Nome', 'ID')

    for(var i=0; i < guildName.length; i++) {
        name = guildName[i]
        id = guildId[i]
        tabela.addRow(i+1, name, id)
        lista = tabela.toString()
    }

    console.log(lista)
});