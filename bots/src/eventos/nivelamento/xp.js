const { EmbedBuilder } = require('discord.js');
const client = require('../..');
const db = require('quick.db');
const config = require('../../../src/util/config.json');
const boostRole = config['sub'][0].role;
const maxLevel = config['nivelamento'][0].maxLevel;
const experience = config['nivelamento'][0].experience;
const maxExperience = config['nivelamento'][0].maxExperience;

//Sistema de nivelamento.
client.on('messageCreate', (message) => {
    if(message.author.bot) return;
    if(message.channel.type == 'dm') return;
    if(message.guild.id === "737035994494140517") {
    
        //Canal que a mensagem será enviada;
        let canal = client.channels.cache.get("922510626956382218");

        //Banco de dados;
        var xp = new db.table('xp');
        var level = new db.table('level');
        var points = new db.table('points');

        //Membro vai receber 15 ~ 25 a cada minuto
        var gainXP = Math.floor(Math.random() * 10) + 15
        const nivel = level.get(`level_${message.author.id}`) || 0;
        if(nivel === null) 
            level.add(`level_${message.author.id}`, 1)

        let checkUser = client.guilds.cache.get("737035994494140517").members.cache.get(message.author.id);
        let checkRole = checkUser.roles.cache.some(role => role.id === boostRole);

        let xpq = "";
        let experiencia = "";
        if(nivel >= maxLevel) {
        } else {
            if(checkRole) {
            experiencia = xp.add(`xp_${message.author.id}`, gainXP+gainXP);
            xpq = nivel * experience;
            } else {
            experiencia = xp.add(`xp_${message.author.id}`, gainXP);
            xpq = nivel * experience;   
            }
        }

        if(xpq < experiencia) {
            if(checkRole) {
                level.add(`level_${message.author.id}`, 1)
                xp.subtract(`xp_${message.author.id}`, xpq)
            
                canal.send(`
                > <a:pink_arrow:987050870183178240> **Parabéns, <@${message.author.id}>** você acabou de subir de nível. <a:pinkheart:922924480446234624> 
                > <a:pink_arrow:987050870183178240> Aqui está sua recompensa por subir para o nível **${nivel+1}**
                > <a:pink_arrow:987050870183178240> **2** <:key:927744143214649404> | **2** :star:
                > <a:pink_arrow:987050870183178240> **<@${message.author.id}>** Recebeu o dobro de recompensa por está **BOOSTADO**.`)

                db.add(`chaves_${message.author.id}`, 1+1)
                points.add(`points_${message.author.id}`, 1+1)
            } else {
                level.add(`level_${message.author.id}`, 1)
                xp.subtract(`xp_${message.author.id}`, xpq)
            
                canal.send(`
                > <a:pink_arrow:987050870183178240> **Parabéns, <@${message.author.id}>** você acabou de subir de nível. <a:pinkheart:922924480446234624> 
                > <a:pink_arrow:987050870183178240> Aqui está sua recompensa por subir para o nível **${nivel+1}**
                > <a:pink_arrow:987050870183178240> **1** <:key:927744143214649404> | **1** :star:`)

                db.add(`chaves_${message.author.id}`, 1)
                points.add(`points_${message.author.id}`, 1)
            }
        }
    }
});