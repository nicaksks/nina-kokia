const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../..');
const db = require("quick.db");
const config = require('../../../src/util/config.json');
const cdn = config['cdn'][0].url;
const boostRole = config['sub'][0].role;

//Meiji vs JP;
client.on('ready', (message) => {

    //Horário da maquina;
    setInterval(function() {
        var data = new Date(); 
        var horas = String(data.getHours()).padStart(2, '0')  + ":";
        var minutos = String(data.getMinutes()).padStart(2, '0');
        var definido = horas + minutos;

        //Data e conversão para Unix para próxima pergunta;
        data = new Date(data.getTime() + 300000);
        const s = Math.floor(data.getTime() / 1000);

        //Horário que o Meiji vai aparecer;
        var horario = ['17:30'];
        let meijiHorario = "";

        //Loop dos horários do Meiji;
        for (let i=0; i < horario.length; ++i) {
            meijiHorario = horario[i]

            //Enviar mensagem quando o Meiji aparecer;
            if(meijiHorario === definido) {

                //Canal em que a mensagem será enviada;
                let canal = client.channels.cache.get("994788562862080141");

                //Banco de dados;
                var points = new db.table('points');
                var xp = new db.table('xp');
                var playersinArena = new db.table('playersinArena');
                var bossEliminated = new db.table('bossEliminated');

                //Filtro
                const filter = i => ['pendrive'].includes(i.customId);
                const collector = canal.createMessageComponentCollector({ filter, time: 300000 });

                //Collector - Início;
                collector.on('collect', i => {
                    if(i.customId === 'pendrive') {

                        //Procurar os usuários no banco de dados;
                        var playerCheck = playersinArena.fetch(`Player_${i.user.id}`)
                        const playersActual = playersinArena.all().filter(data => data.ID.startsWith('Player_'));

                        //Se o jogador for do mesmo ID não vai acontecer nada;
                        //Se o jogador for de ID diferente ele é colocado no banco dados;
                        if(playerCheck === i.user.id) {
                        } else {
                            playersinArena.set(`Player_${i.user.id}`, i.user.id)
                        }

                        //Pega todos os jogadores do banco de dados;
                        const players = playersinArena.all().filter(data => data.ID.startsWith('Player_'));
            
                        //Puxar o ID do jogadores;
                        let jogadores = "";

                        //Recomensa inicial começa em 5;
                        //A cada um jogador aumenta mais uma estrela;
                        let reward = 5 + players.length;
                        let rewardXP = 100 + players.length * 10

                        //Checkar todos os jogadores;
                        for (let i=0; i < players.length; ++i) {
                            jogadores += '<@' + players[i]['data'].split('"')[1] + '> \n'
                        }

                        //EMBED será editada depois que um jogador entrar na fila;
                        embed.setDescription(`
                            Ajude o **JP** a vencer a partida.
                            **JP** acabou de invadir o **Centro de Pesquisa** 

                            Distraia o **Meiji** enquanto o **JP** tenta encontrar o painel de controle.

                            **JOGADORES AJUDANDO**
                            ${jogadores}

                            **RECOMPENSA**
                            > **\`+\`** **${reward} Estrela(s)** ⭐
                            > **\`+\`** **${rewardXP} Experiência** <:xp:990677571542843484>

                            A chance de **hackear** aumenta conforme mais jogadores ajudam.
                            A sala será fechada <t:${s}:R>`)

                        //Enviar a EMBED editada;
                        i.update({ embeds: [embed], components: [button] }).then(interaction => setTimeout(() => { i.deleteReply().catch(error => console.log('[Meiji] - Ocorreu um erro ao deletar a EMBED do Dr.Meiji.'))}, 310000))
                    }
                });

                //Collector END.
                collector.on('end', i => {

                    if(i.size) {

                        //Procurar os usuários no banco de dados;
                        const playersActual = playersinArena.all().filter(data => data.ID.startsWith('Player_'));

                        //Pega todos os jogadores do banco de dados;
                        const players = playersinArena.all().filter(data => data.ID.startsWith('Player_'));
            
                        //Puxar o ID do jogadores;
                        let jogadores = "";

                        //Recomensa inicial começa em 5;
                        //A cada um jogador aumenta mais uma estrela;
                        let reward = 5 + players.length;
                        let rewardXP = 100 + players.length * 10

                        //Checkar todos os jogadores;
                        for (let i=0; i < players.length; ++i) {
                            jogadores += '<@' + players[i]['data'].split('"')[1] + '> \n'
                        }

                        //Chance de falhar
                        let randomNumber = Math.floor(Math.random() * 100) + 1;
                        let chanceToFail = (40 + players.length) > 90 ? 90 : 50 + players.length;

                        if(randomNumber >= chanceToFail) {

                            embed.setTitle('PARABÉNS! Vocês conseguiram ajudar o JP.')
                            embed.setThumbnail()
                            embed.setDescription(
                            `**JP** está agradecido por terem ajudado ele a eliminar o **Dr Meiji**
                            A recompensa será distribuida para os seguintes jogadores:

                            ${jogadores}

                            **RECOMPENSA FINAL NORMAL**
                            > **\`+\`** **${reward} Estrela(s)** ⭐
                            > **\`+\`** **${rewardXP} Experiência** <:xp:990677571542843484>

                            **RECOMPENSA FINAL BOOSTADA**
                            > **\`+\`** **${2 * reward} Estrela(s)** ⭐
                            > **\`+\`** **${2 * rewardXP} Experiência** <:xp:990677571542843484>`)
                            embed.setColor('93C66A')
                            embed.setImage()
                            embed.setFooter({ text: ' ' })


                            //Checkar todos os jogadores;
                            for (let i=0; i < players.length; ++i) {
                                playersReward = players[i]['data'].split('"')[1];

                                //Verificar se o usuário tem o cargo de Sub;
                                let checkUser = client.guilds.cache.get("737035994494140517").members.cache.get(playersReward);
                                let checkRole = checkUser.roles.cache.some(role => role.id === boostRole)

                
                                if(checkRole) {
                                    //Adicionando recompensa para quem é boostado;
                                    points.add(`points_${playersReward}`, 2 * reward);
                                    xp.add(`xp_${playersReward}`, 2 * rewardXP);
                                } else {
                                    //Adicionando recompensa;
                                    points.add(`points_${playersReward}`, reward);
                                    xp.add(`xp_${playersReward}`, rewardXP);
                                }
                                bossEliminated.add(`meiji_${playersReward}`, 1)
                            }

                            //Enviar a EMBED;
                            canal.send({ embeds: [embed], components: [] });

                            //Deletar todos os jogadores do banco de dados, quando a partida acabar;
                            for (let i=0; i < players.length; ++i) {
                                playersinArena.delete(`Player_${players[i]['data'].split('"')[1]}`)
                            }

                        } else {

                            //Embed caso o pessoal perca;
                            embed.setTitle('EXPERIMENTO FINALIZADO')
                            embed.setThumbnail()
                            embed.setDescription(`
                                Vocês não conseguiram ajudar o **JP**
                                **Meiji** eliminou todos vocês.`)
                            embed.setColor('#343641')
                            embed.setImage()
                            embed.setFooter({ text: ' ' })

                            canal.send({ embeds: [embed], components: [] });

                            //Deletar todos os jogadores do banco de dados, quando a partida acabar;
                            for (let i=0; i < players.length; ++i) {
                                playersinArena.delete(`Player_${players[i]['data'].split('"')[1]}`)
                            }
                        }
                    } else {
                        canal.send('**AVISO** \nO mini-game **Meijo vs JP** foi cancelado. \n**Motivo**: __Falta de jogadores.__')
                    }
                });

                //Pendrive (Botão);
                let button = new ActionRowBuilder()
                .addComponents( new ButtonBuilder()
                    .setCustomId('pendrive')
                    .setLabel('Ajudar')
                    .setEmoji('<:pendrive:991015965443624960>')
                    .setStyle(ButtonStyle.Primary));

                //Embed do Meiji;
                const embed = new EmbedBuilder()
                .setTitle(`Dr. Meiji apareceu!`)
                .setThumbnail('https://static.wikia.nocookie.net/blacksurvival_gamepedia_en/images/8/8a/Network_PC.png/revision/latest/scale-to-width-down/256?cb=20210516094404')
                .setDescription(`
                Ajude o **JP** a vencer a partida.
                **JP** acabou de invadir o **Centro de Pesquisa** 

                Distraia o **Meiji** enquanto o **JP** tenta encontrar o painel de controle.

                **JOGADORES AJUDANDO**
                Atualmente não tem ninguém ajudando.

                **RECOMPENSA**
                > **\`+\`** **5 Estrela(s)** ⭐
                > **\`+\`** **100 Experiência** <:xp:990677571542843484>

                A chance de **hackear** aumenta conforme mais jogadores ajudam.
                A sala será fechada <t:${s}:R>`)
                .setColor('#FFFFFF')
                .setImage('https://ninabot.netlify.app/files/uploads/Meiji.png')
                .setFooter({ text: 'Clique no botão para ajudar o JP' })
                canal.send({ embeds: [embed], components: [button] }).then(message => setTimeout(() => { message.delete().catch(error => console.log('[Meiji] - Ocorreu um erro ao deletar a EMBED do Dr.Meiji.'))}, 310000))
            }
        }
    }, 60000)
})