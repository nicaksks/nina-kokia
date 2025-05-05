const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const db = require("quick.db");
const config = require('../../../src/util/config.json');
const boostRole = config['sub'][0].role;
const maxLevel = config['nivelamento'][0].maxLevel;
const experience = config['nivelamento'][0].experience;
const maxExperience = config['nivelamento'][0].maxExperience;
const ms = require("parse-ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('[✂️] - Veja o seu perfil pessoal.'),
  async execute(interaction, message, client) {

    //Mandar mensagem e deletar logo após;
    await interaction.reply('ㅤ')
    interaction.deleteReply()


    let membro = interaction.user

    //Banco de dados;
    var points = new db.table('points');
    var np = new db.table('np');
    var level = new db.table('level');
    var xp = new db.table('xp');
    var acoin = new db.table('acoin');
    var pointsRanking = new db.table('pointsRanking');
    var waifu = new db.table('waifu');
    var daily = new db.table('daily');

    //Fetch;
    let chaves = db.fetch(`chaves_${membro.id}`);
    let pointsf = points.fetch(`points_${membro.id}`);
    let npf = np.fetch(`np_${membro.id}`);
    let levelf = level.fetch(`level_${membro.id}`);
    let xpf = xp.fetch(`xp_${membro.id}`);
    let acoinf = acoin.fetch(`acoin_${membro.id}`);
    let quizBoard = pointsRanking.fetch(`pointsRanking_${membro.id}`) || 0;
    let dailyF = await daily.get(`daily_${membro.id}`);

    //Waifu
    //Icon
    const tagImage = {
      "Comum": "<:Common:988552878690013274>",
      "Incomum": "<:Uncommon:988531069789827192>",
      "Rara": "<:Rare:988552884415262790>",
      "Epica": "<:Epic:988552879516303381>",
      "Mítica": "<:Mythic:988552882783670314>",
      "Lendária": "<:Legend:988552881336635472>"
    }

    //Caso seja menor que -0;
    if (chaves < 1) { chaves = 0};
    if (pointsf < 1) { pointsf = 0};
    if (npf < 1) { npf = 0};
    if (levelf < 1) { levelf = 1};
    if (xpf < 1) { xpf = 0};
    if (acoinf < 1) { acoinf = 0};
    let ea = 0;

    //Verificar se o usuário tem o cargo de Sub;
    const boostCheck = interaction.member.roles.cache.has(boostRole);
    let boost = "";

    //Boost de XP e Economia 2x; 
    if (boostCheck) {
      boost = '<:xp:990677571542843484> **Experiência**: 2x \n<:key:927744143214649404> **Chaves:** 2x \n⭐ **Estrelas**: 2x';
    } else {
      boost = `Você não possui nenhum **boost**. \nAdquira **boost** dando sub \nem **[anniesemtrema](https://twitch.tv/anniesemtrema)**`;
    }

    //Emoji da Barra de Experiência;
    const fullStart = "<:barfull1:991696668581961810>";
    const fullMiddle = "<:barfull2:991696667483050015>";
    const fullEnd = "<:barfull3:991696666199601174>";
    const max = "<:barfull1:991696668581961810><:barfull2:991696667483050015><:barfull2:991696667483050015><:barfull2:991696667483050015><:barfull3:991696666199601174>";

    const emptyStart = "<:bar1:991696663297138839>";
    const emptyMiddle = "<:bar2:991696661707509810>";
    const emptyEnd = "<:bar3:991696664677056613>";

    //Barra de Experiência
    let levelBar = fullStart + "";
    let levelBarLength = 5;
    let levelNextLevel = levelf * experience || experience
    let levelPercent = Math.round(xpf / levelNextLevel * 100, 1) || 0
    let percent = xpf / levelNextLevel;

    //Loop da Barra;
    for (let i = 0; i < levelBarLength; i++) {
      if (i <= Math.floor(levelBarLength * percent - 1)) {
        levelBar += fullMiddle;
      } else {
        if(i < levelBarLength - 1) {
          levelBar += emptyMiddle;
        } else {
          levelBar += emptyEnd;
        }
      }
    }

    //Verificar se o usuário já alcançou o nível máximo;
    let levelCheck = "";
    if(levelf >= maxLevel) {
      levelCheck = `Nível máximo! **\`${levelf}\`** \n${max} **100%**`;
    } else {
      levelCheck = `Você está nível **\`${levelf}\`** \n${levelBar} **${levelPercent}%**`;
    }

    //Verificar se o usuário já alcançou a experiência máxima do servidor.
    let xpCheck = "";
    if(xpf >= maxExperience) {
      xpCheck = `**(${maxExperience}/${maxExperience})**`;
    } else {
      xpCheck = `**(${xpf}/${levelNextLevel})**`;
    }

    //Quiz Check;
    let quiz = "";
    if(quizBoard > 1) {
      quiz = `Acertou **${quizBoard}** pergunta(s).`;
    } else {
      quiz = 'Você ainda não respondeu nenhuma pergunta.';
    }


    //Collector 
    const filter = i => ['daily'].includes(i.customId) && i.user.id === interaction.user.id; 
    const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 30000, errors: ['time'] });

    //Tempo da recompensa diária resetada;
    const cd = 86400000;

    collector.on('collect', async i => {
      if(i.customId === 'daily') {

        const embedreward = new EmbedBuilder()
        .setTitle("RECOMPENSA DIÁRIA DISPONÍVEL!")
        .setColor("#FFFFFF")

        //Recompensa Diária;
        if(dailyF !== null && cd - (Date.now() - dailyF) > 0) {
          let time = (cd - (Date.now() - dailyF));
        } else {
          if(boostCheck) {
            daily.set(`daily_${interaction.user.id}`, Date.now());
            points.add(`points_${interaction.user.id}`, 20);
            xp.add(`xp_${interaction.user.id}`, 200);

            embedreward.setDescription(`Você resgatou sua recompensa diária. \n\`20\` **Estrelas** ⭐ \`200\` **Experiência** <:xp:990677571542843484>. \nSua recompensa é **BOOSTADA** por você ser **SUB** na live da **nica**.`)
            i.update({ embeds: [embedreward], components: [] });

          } else {
            daily.set(`daily_${interaction.user.id}`, Date.now());
            points.add(`points_${interaction.user.id}`, 10);
            xp.add(`xp_${interaction.user.id}`, 100);

            embedreward.setDescription(`\n\nVocê resgatou sua recompensa diária. \n\`10\` **Estrelas** ⭐ \`100\` **Experiência** <:xp:990677571542843484>.`)
            i.update({ embeds: [embedreward], components: [] });
          }
        }
      }
    })

    //Button
    let button;

    if(dailyF !== null && cd - (Date.now() - dailyF) > 0) {
      button = new ActionRowBuilder()
        .addComponents( new ButtonBuilder()
          .setCustomId('daily')
          .setLabel('Recompensa resgatada')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true));
    } else {
      button = new ActionRowBuilder()
        .addComponents( new ButtonBuilder()
          .setCustomId('daily')
          .setLabel('Clique para resgatar')
          .setStyle(ButtonStyle.Primary));
    }

    //Tempo restante para resgar a recompensa diária;
    let time = ms(cd - (Date.now() - dailyF));
    let tempRestante = "";

    if(time.minutes <= -0) {
      tempRestante = 'Sua recompensa diária está disponível!'
    } else {
      tempRestante = `Recompensa diária disponível em: ${time.hours} hora(s) ${time.minutes} minuto(s) ${time.seconds} segundo(s)`;
    }

    //Embed
    let embed = new EmbedBuilder()
    .setTitle(`Geral - ${interaction.user.username}`)
    .setDescription(`

    **NIVELAMENTO**
    ${levelCheck}
    ${xpCheck}`)
    .addFields({ name: 'ECONOMIA', value: `
    <:key:927744143214649404> **Chaves**: ${chaves}
    ⭐ **Estrelas**: ${pointsf}
    <:np:989210982922457098> **NP**: ${npf} 
    <:ACoin:988530798179270656> **A-coin**: ${acoinf}
    <:EA:966378501575962654>**EA**: ${ea}`, inline: true })
    .addFields({ name: 'VANTAGENS', value: boost, inline: true })
    .addFields({ name: '** **', value: '** **', inline: true })
    .addFields({ name: '<!-- -- MINI-GAMES -- -- >', value: '** **', inline: false })
    .addFields({ name: 'Quiz', value: quiz, inline: true })
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }))
    .setFooter({ text: tempRestante })
    .setColor("#FFFFFF")

    interaction.channel.send({ content: `||<@${interaction.user.id}>||`, embeds: [embed], components: [button] })
  },
};