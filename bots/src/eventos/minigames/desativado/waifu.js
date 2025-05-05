const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../..');
const db = require("quick.db");
const config = require('../../../src/util/config.json');
const cdn = config['cdn'][0].url;
const boostRole = config['sub'][0].role;

client.on('ready', async (message) => {

    //Canal que a mensagem será enviada;
    let canal = client.channels.cache.get("994788562862080141");

    //Banco de dados;
    const waifu = new db.table('waifu');
    const acoin = new db.table('acoin');
    const np = new db.table('np');

    //Funcão do setInterval;
    setInterval(function (){

        var data = new Date(); 
        var horas = String(data.getHours()).padStart(2, '0')  + ":"
        var minutos = String(data.getMinutes()).padStart(2, '0');
        var definido = horas + minutos

        //Horário que uma carta vai aparecer;
        var horario = ['20:45'];
        let horarioArray = "";

        //Loop dos horários;
        for (let i=0; i < horario.length; ++i) {
            horarioArray = horario[i]
            
            if(horarioArray == definido) {

                //Filter;
                const filter = i => ['casar', 'buttonNP'].includes(i.customId);
                const collector = canal.createMessageComponentCollector({ filter, max: 1, time: 60000, erros: ['time'] });  

                //Verificar quantas cartas e rodar um número baseado na quantidade de cartas;
                const totalWaifu = waifu.all().filter(data => data.ID)
                const random = Math.floor(Math.random() * totalWaifu.length) + 1;
                const card = waifu.fetch(`${random}`);
                const npCard = random + 15;

                const tagImage = {
                    "Comum": "<:Common:988552878690013274>",
                    "Incomum": "<:Uncommon:988531069789827192>",
                    "Rara": "<:Rare:988552884415262790>",
                    "Epica": "<:Epic:988552879516303381>",
                    "Mítica": "<:Mythic:988552882783670314>",
                    "Lendária": "<:Legend:988552881336635472>"
                }

                //Backend - image
                const backImage = cdn + card.name + ".png"

                //Embed
                const embed = new EmbedBuilder()
                .setTitle(`${card.name} ${tagImage[card.tier]}`)
                .setDescription(`**STATUS** \n\`Ataque:\` **${card.power}** <:AttackPower:988530495237292072> **|** \`Defesa:\` **${card.defense}** <:Defense:988531421045997658> \n\n**INFORMAÇÕES** \n\`A-coin:\` **${card.coins}** <:ACoin:988530798179270656> \n\`Tier:\` **${card.tier}** ${tagImage[card.tier]}`)
                .setImage(backImage)

                //Botão para se casar;
                let casar = new ActionRowBuilder()
                .addComponents( new ButtonBuilder()
                .setCustomId('casar')
                .setEmoji('<:Coracao:988530135059816520>')
                .setStyle(ButtonStyle.Secondary));

                //Botão para resgatar A-coin
                let buttonNP = new ActionRowBuilder()
                .addComponents( new ButtonBuilder()
                .setCustomId('buttonNP')
                .setLabel(`${npCard}ﾠ`)
                .setEmoji('<:np:989210982922457098>')
                .setStyle(ButtonStyle.Secondary));

                collector.on('collect', async i => {
                    if(i.customId === 'casar') {
                        embed.setColor('#CF2E2E')
                        embed.setFooter({ text: `Pertence a: ${i.user.username}` })
                        i.update({ embeds: [embed], components: [] })
                        waifu.set(`${random}`, { id: card.id, name: card.name, coins: card.coins, owner: i.user.id, ownerTag: i.user.username, owned: "1", image: card.image, power: card.power, defense: card.defense, tier: card.tier, game: card.game });
                        acoin.add(`acoin_${i.user.id}`, card.coins)
                        return canal.send({ content: `||<@${i.user.id}>|| \n**Parabéns**, você conseguiu conquistar a carta **${card.name} (${card.tier} ${tagImage[card.tier]})**` });
                    }
                    if(i.customId === 'buttonNP') {
                        i.update({ embeds: [embed], components: [] })
                        np.add(`np_${i.user.id}`, npCard)
                        return canal.send(`||<@${i.user.id}>|| \n> **+ ${npCard} (NP)** <:np:989210982922457098>`)
                    }
                })

                if(card.owner > 1) {
                    embed.setColor("#CF2E2E")
                    embed.setFooter({ text: `Pertence a: ${card.ownerTag}` })
                    canal.send({ embeds: [embed], components: [buttonNP] })
                } else {
                    embed.setColor("#5FCF2E")
                    canal.send({ embeds: [embed], components: [casar] });
                }

                //End
                collector.on('end', async i => {
                    if(i.size === 0)
                        canal.send(`O tempo para **conquistar/resgatar** a **carta** **${card.name}** ou **${npCard} (NP)** <:np:989210982922457098> foi finalizado. \nUma nova **carta** vai aparecer dentro de algumas **horas.**`);
                })
            }
        }
    }, 60000)
})
