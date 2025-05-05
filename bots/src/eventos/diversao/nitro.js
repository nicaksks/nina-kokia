const client = require('../..');
const db = require('quick.db');
const config = require('../../../src/util/config.json');
const boostRole = config['sub'][0].role;

client.on("guildMemberUpdate", (oldMember, newMember) => {

    //Informações dos membros;
    const oldStatus = oldMember.premiumSince;
    const newStatus = newMember.premiumSince;

    //Banco de dados;
    var xp = new db.table('xp');
    var points = new db.table('points');

    //Verificar se o membro é sub do canal;
    try {
        let checkUser = client.guilds.cache.get("737035994494140517").members.cache.get(newMember.user.id);
        let checkRole = checkUser.roles.cache.some(role => role.id === boostRole)
    
    if(checkRole) {
        if(!oldStatus && newStatus) {
            client.channels.cache.get('994788562862080141').send(`**${newMember.user.tag}**, obrigada por ajudar a **boostar** o servidor. \nObrigada por também ser **sub** na live **ʕ •̀ o •́ ʔ** \nPor você ser **sub** e por ter ajudado a **boostar** o servidor, tome aqui **3x** a mais de recompensa **ヽ(”\`▽\´)ﾉ** \n> <a:pink_arrow:987050870183178240> **3** <:key:927744143214649404> | **3** ⭐ | **300** <:xp:990677571542843484>`);
            xp.add(`xp_${newMember.user.id}`, 300);
            points.add(`points_${newMember.user.id}`, 3);
            db.add(`chaves_${newMember.user.id}`, 3);
        };
    } else {
        if(!oldStatus && newStatus) {
            client.channels.cache.get('994788562862080141').send(`**${newMember.user.tag}**, obrigada por ajudar a **boostar** o servidor. \n> <a:pink_arrow:987050870183178240> **2** <:key:927744143214649404> | **2** ⭐ | **200** <:xp:990677571542843484>`);
            xp.add(`xp_${newMember.user.id}`, 200);
            points.add(`points_${newMember.user.id}`, 2);
            db.add(`chaves_${newMember.user.id}`, 2);
        };
    };
        } catch(e) {
        console.error('Ocorreu um erro');
    }
});