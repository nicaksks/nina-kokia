const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const config = require('../../../src/util/config.json');
const cdn = config['cdn'][0].url;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('colecao')
    .setDescription('[Cartas] [Waifu] - Coleção pessoal.'),
  async execute(interaction, message, client) {

    //Mandar mensagem e deletar logo após;
    await interaction.reply('Servidor está com instabilidade. \nAguarde uns segundos.')
    interaction.deleteReply()

    //Banco de dados - Regras;
    const rules = new db.table('rules');
    const waifu = new db.table('waifu');
    const totalWaifu = waifu.all().filter(data => data.ID);

    //Filter;
    const filter = i => ['meAccept'].includes(i.customId);
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000, erros: ['time'] });

    //Caso a pessoa não tenha permissão, será enviada essa embed;
    const embed = new EmbedBuilder()
    .setTitle(`Permissão para participar!`)
    .setDescription(
    `**CASO VOCÊ NÃO OBEDEÇA AS REGRAS ABAIXO SUA CONTA PODE SER BANIDA OU RESETADA!**

    <a:pink_arrow:987050870183178240> Proibido usar qualquer coisa que você possa obter vantagem com ajuda de programas.
    <a:pink_arrow:987050870183178240> Você não pode vender seus **personagens** por **dinheiro real** ou trocar por **itens físico**.
    <a:pink_arrow:987050870183178240> Você pode ler as outras regras **[clicando aqui.](https://www.hyejinbot.com)**

    > Caso você esteja de acordo com as **regras** acima, clique no botão **Eu concordo**.`)
    .setColor("FFFFFF")

    //Botão para aceitar as regras;
    let rulesAccept = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('meAccept')
      .setLabel('Eu concordo')
      .setEmoji('<:euconcordo:988479687762260028>')
      .setStyle(ButtonStyle.Secondary));

    //Função do botão casar;
    collector.on('collect', async i => {
      if(i.customId === 'meAccept') {
        embed.setTitle(`${interaction.user.username}, aceitou as regras.`)
        embed.setColor("#2EFE2E")
        i.update({ content: `||<@${interaction.user.id}>||`, embeds: [embed], components: [] }).catch(err => console.log('[Waifu] - Ocorreu um erro na hora de aceitar as regras.'))
        rules.set(`rules_${interaction.user.id}`, interaction.user.id)
      }
    })
  
    var membersAccept = rules.fetch(`rules_${interaction.user.id}`);

    //Embed Coleção
    const myCollection = new EmbedBuilder()
    .setTitle(`Coleção de ${interaction.user.username}`)

    //Botões de < or >
    let buttonLR = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('left')
      .setLabel('<')
      .setStyle(ButtonStyle.Secondary))
    .addComponents( new ButtonBuilder()
      .setCustomId('right')
      .setLabel('>')
      .setStyle(ButtonStyle.Secondary));

    //Icon
    const tagImage = {
      "Comum": "<:Common:988552878690013274>",
      "Incomum": "<:Uncommon:988531069789827192>",
      "Rara": "<:Rare:988552884415262790>",
      "Epica": "<:Epic:988552879516303381>",
      "Mítica": "<:Mythic:988552882783670314>",
      "Lendária": "<:Legend:988552881336635472>"
    }

    //Variável fora do For
    let cardName = "";
    let cardPower = "";
    let cardDefense = "";
    let cardAcoin = "";
    let cardTier = "";
    let cardNameImage = "";
    let cardImage = "";

    //Caso o membro tenha aceitado as regras;
    if(membersAccept === interaction.user.id) {
      for (let i=1; i <= totalWaifu.length; ++i) {

        card = waifu.get(`${i}`)
        if(card.owner === interaction.user.id) {

          //Variável
          cardName += `\n${tagImage[card.tier]} **${card.name}**`;
          cardPower += card.power + "\n";
          cardDefense += card.defense + "\n";
          cardAcoin += card.acoin + "\n";
          cardTier += card.tier + "\n";
          cardNameImage = card.name.split(" ")[0];
          cardImage = card.image + "\n".split(" ")[0];

        }
      } 

      const backImage = cdn + cardNameImage + ".png";;

      //Embed
      myCollection.setDescription(`\n${cardName}`)
      myCollection.setColor('#0CB8ED')
      myCollection.setImage(backImage)
      myCollection.setFooter({ text: `Essa coleção pertence a: ${interaction.user.username}` })
      interaction.channel.send({ embeds: [myCollection], components: [] }) 

    } else {
      interaction.channel.send({ content: `||<@${interaction.user.id}>||`, embeds: [embed], components: [rulesAccept] });
    }
  },
};
