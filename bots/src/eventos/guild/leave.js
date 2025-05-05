const client = require('../..');

client.on('guildCreate', guild => {

    const dm = client.users.cache.get(guild.ownerId)
    const guilds = guild.id;

    if(guild.id === "737035994494140517") {
        //console.log('Guild permitida pela nina!');
    } else {
        dm.send(`<@${guild.ownerId}> Obrigada por querer me adicionar ao seu servidor, porém a **nina** não está disponível ao **público**. \n**nina** está sendo removida automaticamente do seu servidor.
            `)
        .then(sair => client.guilds.cache.get(guild.id).leave())
        .catch(erro => client.guilds.cache.get(guild.id).leave());
    }
})