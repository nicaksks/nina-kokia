const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const config = require('../../../src/util/config.json');
const cdn = config['cdn'][0].url;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('db')
    .setDescription('[Cartas] [Waifu] - Pesquise os personagens no banco de dados;')
    .addStringOption(option =>
      option.setName('opcao')
      .setDescription('Escolha uma opção.')
      .setRequired(true)
      .addChoices(
        { name: 'Procurar', value: 'search' }
      ))
    .addStringOption(option => option
    .setName('personagem')
    .setDescription('Coloque o nome do personagem.')
    .setRequired(true)),
  async execute(interaction, message, client) {

    //Mandar mensagem e deletar logo após;
    await interaction.reply('Servidor está com instabilidade. \nAguarde uns segundos.')
    interaction.deleteReply()

    //Opções - Personagem
    const options = interaction.options.getString('opcao');
    const personagem = interaction.options.getString('personagem');

    //Banco de dados - Regras;
    const rules = new db.table('rules');
    const waifu = new db.table('waifu');
    const totalWaifu = waifu.all().filter(data => data.ID);

    let card = "";
    let cardName = "";
    let cardGeral = "";
    let cardOwner = "";
    let cardTitle = "";
    let cardImage = "";
    let cardOwned = "";

    //Icon
    const tagImage = {
        "Comum": "<:Common:988552878690013274>",
        "Incomum": "<:Uncommon:988531069789827192>",
        "Rara": "<:Rare:988552884415262790>",
        "Epica": "<:Epic:988552879516303381>",
        "Mítica": "<:Mythic:988552882783670314>",
        "Lendária": "<:Legend:988552881336635472>"
    }

    for (let i=1; i <= totalWaifu.length; ++i) {
      card = waifu.get(`${i}`)

      if(card.name.toLowerCase() === personagem.toLowerCase()) {
          cardName += card.name + "\n";
          cardGeral += `**STATUS** \n\`Ataque:\` **${card.power}** <:AttackPower:988530495237292072> **|** \`Defesa:\` **${card.defense}** <:Defense:988531421045997658> \n\n**INFORMAÇÕES** \n\`A-coin:\` **${card.coins}** <:ACoin:988530798179270656> \n\`Tier:\` **${card.tier}** ${tagImage[card.tier]}`
          cardTitle += `${card.name} ${tagImage[card.tier]}`
          cardOwner += card.ownerTag + "\n";
          cardImage += card.image + "\n";
          cardOwned += card.owner + "\n";
      }
    }

    //Filter;
    const filter = i => ['meAccept'].includes(i.customId);
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType:'BUTTON', time: 60000, erros: ['time'] });

    //Caso a pessoa não tenha permissão, será enviada essa embed;
    const embed = new EmbedBuilder()
    .setTitle(`Permissão para participar!`)
    .setDescription(
    `**CASO VOCÊ NÃO OBEDEÇA AS REGRAS ABAIXO SUA CONTA PODE SER BANIDA OU RESETADA!**

    <a:pink_arrow:987050870183178240> Proibido usar qualquer coisa que você possa obter vantagem com ajuda de programas.
    <a:pink_arrow:987050870183178240> Você não pode vender seus **personagens** por **dinheiro real** ou trocar por **itens físico**.
    <a:pink_arrow:987050870183178240> Você pode ler as outras regras **[clicando aqui.](https://www.twitch.tv/anniesemtrema)**

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
    
    //Cdn
    const cardImageName = cdn + personagem + ".png";
    var membersAccept = rules.fetch(`rules_${interaction.user.id}`);

    //Embed
    const embedCard = new EmbedBuilder()
    .setTitle(cardTitle || 'Essa carta não existe.')
    .setDescription(cardGeral || 'Não foi encontrado nenhuma carta com esse nome.')
    .setImage(cardImageName)

    if(membersAccept === interaction.user.id) {
      if(options === 'search') {
        if(cardOwned > 1) {

          //Caso a carta seja de alguém;
          embedCard.setColor("#CF2E2E")
          embedCard.setFooter({ text: `Pertence a: ${cardOwner}` })
          interaction.channel.send({ content: `||<@${interaction.user.id}>||`, embeds: [embedCard] })

        } else {

          //Caso a carta não seja de ninguém;
          embedCard.setColor("#FFFFFF")
          interaction.channel.send({ content: `||<@${interaction.user.id}>||`, embeds: [embedCard] }).catch(err => interaction.channel.send(`A carta **${personagem}** não existe no banco de dados da **nina**.`));

        }
      }
    } else {
      interaction.channel.send({ content: `||<@${interaction.user.id}>||`, embeds: [embed], components: [rulesAccept] });
    }
  },
};