const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const config = require('../../../src/util/config.json');
const cdn = config['cdn'][0].url;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('negociar')
    .setDescription('[Cartas] [Waifu] - Troque suas cartas com os seus amigos.')
    .addUserOption(option => option
      .setName('usuário')
      .setDescription('Selecione um amigo.')
      .setRequired(true))
    .addStringOption(option => option
      .setName('carta')
      .setDescription('Selecione um personagem.')
      .setRequired(true)),
  async execute(interaction, message, client) {

    //Mandar mensagem e deletar logo após;
    await interaction.reply('Servidor está com instabilidade. \nAguarde uns segundos.')
    interaction.deleteReply()

    //Stringer
    const usuario = interaction.options.getUser('usuário');
    const personagem = interaction.options.getString('carta');
    const personagemT = personagem.charAt(0).toUpperCase() + personagem.slice(1);

    //Banco de dados;
    const rules = new db.table('rules');
    const waifu = new db.table('waifu');
    const totalWaifu = waifu.all().filter(data => data.ID);
    var membersAccept = rules.fetch(`rules_${interaction.user.id}`);

    //Filter;
    const filter = i => ['meAccept', 'sim', 'nao'].includes(i.customId) && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 60000, erros: ['time'] });

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

    //Botões de Sim or Não
    let tradeButton = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('sim')
      .setLabel('Sim')
      .setStyle(ButtonStyle.Success))
    .addComponents( new ButtonBuilder()
      .setCustomId('nao')
      .setLabel('Não')
      .setStyle(ButtonStyle.Danger));

    //Embed - Troca
    const trade = new EmbedBuilder()
    .setTitle(`${interaction.user.username} está negociando com ${usuario.username} `)
    .setColor("#BCA9F5")

    let card = "";
    let cardName = "";
    let cardImage = "";
    let cardOwner = "";

    //Icon
    const tagImage = {
        "Comum": "<:Common:988552878690013274>",
        "Incomum": "<:Uncommon:988531069789827192>",
        "Rara": "<:Rare:988552884415262790>",
        "Epica": "<:Epic:988552879516303381>",
        "Mítica": "<:Mythic:988552882783670314>",
        "Lendária": "<:Legend:988552881336635472>"
    }

    let tradeID = ""
    let tradeName = "";
    let tradeCoins = "";
    let tradeOwner = "";
    let tradeTag = "";
    let tradeOwned = "";
    let tradeImage = "";
    let tradePower = "";
    let tradeDefense = "";
    let tradeTier = "";
    let tradeGame = "";

    //Cdn
    const cardImageName = cdn + personagem + ".png";

    //Botão para concordar com as regras;
    collector.on('collect', async i => {

      //Botão - Aceitar [Regras]
      if(i.customId === 'meAccept') {
        
        embed.setTitle(`${interaction.user.username}, aceitou as regras.`)
        embed.setColor("#2EFE2E")
        i.update({ content: `||<@${interaction.user.id}>||`, embeds: [embed], components: [] }).catch(err => console.log('[Waifu] - Ocorreu um erro na hora de aceitar as regras.'))
        rules.set(`rules_${interaction.user.id}`, interaction.user.id)
      }


      //Botão - Aceitar [Negociação]
      if(i.customId === "sim") {

        trade.setTitle("Negociação concluida com sucesso!")
        trade.setDescription(`**${personagemT}** agora pertence a **${usuario.username}**`)
        trade.setColor("#5FCF2E")
        trade.setImage(cardImageName)
        trade.setFooter({ text: " " })
        i.update({ content: `||<@${i.user.id}> <@${usuario.id}> ||`, embeds: [trade], components: [] }).catch(error => interaction.channel.send('Ocorreu um erro na hora da negociação.'))
        waifu.set(tradeID, { id: tradeID, name: tradeName, coins: tradeCoins, owner: tradeOwner, ownerTag: tradeTag, owned: tradeOwned, image: cardImageName, power: tradePower, defense: tradeDefense, tier: tradeTier, game: tradeGame });
        collector.stop()
      }

      //Botão - Recusar [Negociação]
      if(i.customId === "nao") {

        trade.setTitle("Negociação falhou.")
        trade.setDescription(`**${i.user.username}** recusou a transição com **${usuario.username}**`)
        trade.setColor("#CF2E2E")
        trade.setImage()
        trade.setFooter({ text: " " })
        i.update({ content: `||<@${i.user.id}> <@${usuario.id}> ||`, embeds: [trade], components: [] }).catch(error => interaction.channel.send('Ocorreu um erro na hora da negociação.'))
        collector.stop()
      }
    })

    //Caso o membro tenha aceitado as regras;
    if(membersAccept === interaction.user.id) {
      
      //Caso o usuário marque ele mesmo;
      if(usuario.id === interaction.user.id)
        return interaction.channel.send(`<@${interaction.user.id}>, Você não pode negociar com você mesmo.`);


      for (let i=1; i <= totalWaifu.length; ++i) {

        card = waifu.get(`${i}`)
        if(card.name.toLowerCase() === personagem.toLowerCase()) {
          if(card.owner === interaction.user.id) {

              //Variável - Embed
              cardName += `**${card.name} ${tagImage[card.tier]}**`;
              cardImage = card.image + "\n";
              cardOwner += card.owner

              //Variável - Trade
              tradeID += card.id
              tradeName += card.name
              tradeCoins += card.coins
              tradeOwner = usuario.id
              tradeTag = usuario.username
              tradeOwned = card.owned
              tradePower += card.power
              tradeDefense += card.defense
              tradeImage += card.image
              tradeTier += card.tier
              tradeGame += card.game

          }
        }
      } 

      if(cardOwner === interaction.user.id) { } else { 
        return interaction.channel.send(`<@${interaction.user.id}>, você não possui essa **carta** ou **personagem**.`) 
      }

      trade.setDescription(`__**PERSONAGEM**__\n ${cardName}`)
      trade.setImage(cardImageName)
      trade.setFooter({ text: `${interaction.user.username} você tem certeza que quer enviar essa carta para ${usuario.username}` })
      interaction.channel.send({ embeds: [trade], components: [tradeButton] });

    } else {
      interaction.channel.send({ content: `||<@${interaction.user.id}>||`, embeds: [embed], components: [rulesAccept] });
    }

    collector.on('end', async i => {
      if(i.size === 0)
        interaction.channel.send(`<@${interaction.user.id}>, o tempo para você **aceitar** ou **recusar negociação** com <@${usuario.id}> acabou. \nCaso queria negociar novamente so usar o comando **/negocioar ${usuario.username} ${personagem}**`);
    })
  },
};
