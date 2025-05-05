const client = require('../..');
const quiz = require('../../../src/assets/quiz/quiz.json');
const db = require("quick.db");
const config = require('../../../src/util/config.json');
const boostRole = config['sub'][0].role;
const guildId = config['nina'][0].guildId;

client.on('ready', (message) => {

    //Canal para a onde a mensagem será enviada;
    let channel = client.channels.cache.get("994788562862080141");

    //Banco de dados;
    var points = new db.table('points');
    var pointsRanking = new db.table('pointsRanking');
    var npEvent = new db.table('npEvent');

    //Funcão do setInterval;
    setInterval(function (){

        var data = new Date(); 
        var horas = String(data.getHours()).padStart(2, '0')  + ":"
        var minutos = String(data.getMinutes()).padStart(2, '0');
        //var segundos = String(data.getSeconds()).padStart(2, '0');
        var definido = horas + minutos

        //Horário que as perguntas vão aparecer
        var horario = [
        '10:00', '11:00', '12:00'
        ];
        let horarioArray = "";

        //Loop dos horários;
        for (let i=0; i < horario.length; ++i) {
            horarioArray = horario[i]

            if(horarioArray == definido) {

                const json = quiz[Math.floor(Math.random() * quiz.length)];
                const filter = response => { 
                    return json.respostas.some(resposta => resposta.toLowerCase() === response.content.toLowerCase());
                };

                //Data e conversão para Unix;
                data = new Date(data.getTime() + 180000);
                const s = Math.floor(data.getTime() / 1000);

                //Data e conversão para Unix para próxima pergunta;
                data = new Date(data.getTime() + 3600000);
                const ss = Math.floor(data.getTime() / 1000);

                const npReward = {
                    0: "",
                    1: "| **300** <:NP_Event:988137137834688623>"
                }

                const npTitle = {
                    0: "",
                    1: " [𝐁𝐎𝐍𝐔𝐒]"
                }

                const npTitle1 = {
                    0: "",
                    1: " **[𝐁𝐎𝐍𝐔𝐒]**"
                }

                //Mensagem que será enviada;
                channel.send({ content:`\n**꒰ 𝐏𝐄𝐑𝐆𝐔𝐍𝐓𝐀${npTitle[json.np]} ꒱** \n> <a:pink_arrow:987050870183178240> \`${json.pergunta}\` \n**꒰ 𝐑𝐄𝐂𝐎𝐌𝐏𝐄𝐍𝐒𝐀${npTitle[json.np]} ꒱** \n> <a:pink_arrow:987050870183178240> **${json.chaves}** <:key:927744143214649404> | **${json.points}** ⭐ ${npReward[json.np]} \n**꒰ 𝐓𝐄𝐌𝐏𝐎 ꒱** \n> <a:pink_arrow:987050870183178240> O tempo para responder essa pergunta vai acabar <t:${s}:R>`, fetchReply: true })
                .then(message => {
                    //Apagar a mensagem depois de 1 minuto;
                    setTimeout(function() { message.delete().catch(err => console.log(' ')) }, 190000)

                    //Verificar se a resposta está certa;
                    channel.awaitMessages({ filter, max: 1, time: 180000, errors: ['time'] })
                    .then(collected => {

                        let checkUser = client.guilds.cache.get(guildId).members.cache.get(collected.first().author.id);
                        let checkRole = checkUser.roles.cache.some(role => role.id === boostRole)

                        if(checkRole) {
                            db.add(`chaves_${collected.first().author.id}`, json.chaves+1);
                            points.add(`points_${collected.first().author.id}`, json.points+1);
                            pointsRanking.add(`pointsRanking_${collected.first().author.id}`, json.points+1);
                            channel.send(`**꒰ 𝐓𝐄𝐌𝐎𝐒 𝐔𝐌 𝐕𝐄𝐍𝐂𝐄𝐃𝐎𝐑! ꒱** \n> <a:pink_arrow:987050870183178240> **${collected.first().author}** acertou a resposta${npTitle1[json.np]}! **ヽ(>∀<☆)ノ** \n> <a:pink_arrow:987050870183178240> **${collected.first().author}** Recebeu o dobro de recompensa por está **BOOSTADO**.  \n**꒰ 𝐏𝐑𝐎𝐗𝐈𝐌𝐀 𝐏𝐄𝐑𝐆𝐔𝐍𝐓𝐀꒱** \n> Próxima pergunta vai está disponível **<t:${ss}:R>**`).then(message => { 
                            setTimeout(function() {message.delete().catch(err => console.log(' '))}, 3600000)});

                        } else {
                            db.add(`chaves_${collected.first().author.id}`, json.chaves);
                            points.add(`points_${collected.first().author.id}`, json.points);
                            pointsRanking.add(`pointsRanking_${collected.first().author.id}`, json.points);
                            channel.send(`**꒰ 𝐓𝐄𝐌𝐎𝐒 𝐔𝐌 𝐕𝐄𝐍𝐂𝐄𝐃𝐎𝐑! ꒱** \n> <a:pink_arrow:987050870183178240> **${collected.first().author}** acertou a resposta${npTitle1[json.np]}! **ヽ(>∀<☆)ノ** \n**꒰ 𝐏𝐑𝐎𝐗𝐈𝐌𝐀 𝐏𝐄𝐑𝐆𝐔𝐍𝐓𝐀꒱** \n> Próxima pergunta vai está disponível **<t:${ss}:R>**`).then(message => { 
                            setTimeout(function() {message.delete().catch(err => console.log(' '))}, 3600000)});
                        }

                        //Caso seja True = NP no privado
                        if(json.np === 1) {
                            const user = collected.first().author.id
                            const npSearch = npEvent.all().filter(data => data.ID.startsWith('np_'));
                            const np = npSearch[0].ID.split("np_")[1]

                            client.users.cache.get(`${user}`).send(`**PARABÉNS** \nVocê acertou a pergunta premiada! Aqui está o seu **NP EVENT** \nCodigo: ||${np}|| <:NP_Event:988137137834688623> \n\nSobre o **NP Event** \nDuração de **7 dias**, você pode ativar até o último dia do mês.`);
                            npEvent.delete(`np_${np}`)
                        }

                        //Banco de dados; [Chaves, Pontuação (Créditos) e Pontuação do Ranking]
                        db.add(`chaves_${collected.first().author.id}`, json.chaves);
                        points.add(`points_${collected.first().author.id}`, json.points);
                        pointsRanking.add(`pointsRanking_${collected.first().author.id}`, json.points);
                    })
                    .catch(collected => {
                        //Se passar do tempo o Quiz será finalizado;
                        channel.send(`**꒰ 𝐀𝐂𝐀𝐁𝐎𝐔 𝐎 𝐓𝐄𝐌𝐏𝐎 ꒱** \n> Ninguém acertou. \n**꒰ 𝐑𝐄𝐒𝐏𝐎𝐒𝐓𝐀 ꒱** \n> A resposta era: **\`${json.respostas.join(', ').replace(/, ([^,]*)$/, ' ou $1')}\`** \n**꒰ 𝐏𝐑𝐎𝐗𝐈𝐌𝐀 𝐏𝐄𝐑𝐆𝐔𝐍𝐓𝐀 ꒱** \n> Próxima pergunta vai está disponível **<t:${ss}:R>**`).then(message => { 
                            setTimeout(function() {message.delete().catch(err => console.log(' '))}, 3600000)})
                    })
                });
            }
        }
    }, 60000)
});