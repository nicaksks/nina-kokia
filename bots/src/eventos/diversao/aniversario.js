const client = require('../..');
const db = require('quick.db');

client.on('ready', async (message) => {

    setInterval(async function() {

        //Canal que a mensagem será enviada;
        let canal = client.channels.cache.get("997205545264107610");

        //Banco de dados;
        var aniversario = new db.table('aniversario')
        var aniversariantes = aniversario.all().filter(data => data.ID);
        var points = new db.table('points');
        var xp = new db.table('xp');

        //Data formada;
        var date = new Date(); 
        var dias = String(date.getDate()).padStart(2, '0')
        var meses = String(date.getMonth() + 1).padStart(2, '0')
        var ano = date.getFullYear()
        const definido = dias + "/" + meses;

        //Horário
        var horas = String(date.getHours()).padStart(2, '0')  + ":"
        var minutos = String(date.getMinutes()).padStart(2, '0')
        var horarioDefinido = horas + minutos;

        //Guild
        var guild = client.guilds.cache.get('737035994494140517');
        const role = await guild.roles.fetch('997215390675509340');

        //Remover o cargo de aniversariante;
        if(horarioDefinido === '23:59') {
            for (let i=1; i <= aniversariantes.length; ++i) {

                check = aniversario.get(`${i}`)
                name = check.name;
            
                const member = await guild.members.fetch(name)
                member.roles.remove(role)
            }
        }

        //Enviar mensagem de parabéns;
        if(horarioDefinido === '00:00') {
            for (let i=1; i <= aniversariantes.length; ++i) {

                check = aniversario.get(`${i}`)
                name = check.name;
                data = check.data;

                aniversarianteDia = data.split("/")[0];
                aniversarianteMes = data.split("/")[1];
                aniversarianteAno = data.split("/")[2];
                final = aniversarianteDia + "/" + aniversarianteMes;
                idade = ano - aniversarianteAno

                if(definido === final) {

                    const member = await guild.members.fetch(name)
                    member.roles.add(role)

                    canal.send(`<@${name}> está de __**aniversário**__ hoje! deem o __**parabéns**__ para ele(a). **٩(ˊᗜˋ*)و** \nEstá fazendo **${idade} anos**. Esperamos que o seu dia seja incrível, assimo como você **ヽ༼ ் ▽ ் ༽╯**`).then(message => message.react('🎂'));
                    points.add(`points_${name}`, 15);
                    db.add(`chaves_${name}`, 5);
                    xp.add(`xp_${name}`, 1000)
                }
            }
        }
    }, 60000)
})