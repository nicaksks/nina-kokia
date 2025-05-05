const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const db = require("quick.db");
const axios = require('axios');
const config = require('../../../src/util/config.json');
const boostRole = config['sub'][0].role;
const maxLevel = config['nivelamento'][0].maxLevel;
const experience = config['nivelamento'][0].experience;
const maxExperience = config['nivelamento'][0].maxExperience;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('duelar')
    .setDescription('[✂️] - Duele com os seus amigos e ganhe Estrelas & Experiência.')
    .addUserOption(option => option
      .setName('usuário')
      .setDescription('Selecione um amigo ou inimigo para duelar.')
      .setRequired(true))
    .addStringOption(option => option
      .setName('estrelas')
      .setDescription('Quantidade de Estrelas que será apostado')
      .setRequired(true)),
  async execute(interaction, client) {

    //Caso a Nina demore mais de 3 segundos para responder;
    interaction.deferReply();

    //Pega o ID do amigo ou inimigo;
    const usuario = await interaction.options.getUser('usuário');
    const coins = await interaction.options.getString('estrelas');
    const totalCoins = 2 * coins
    let membro = interaction.user

    //Banco de dados;
    var points = new db.table('points');
    var xp = new db.table('xp');
    var self = points.fetch(`points_${interaction.user.id}`);
    var adversario = points.fetch(`points_${usuario.id}`);

    //Buscando ás imagens na API do Otakugifs;
    const slapSearch = await axios.get(`https://api.otakugifs.xyz/gif?reaction=slap&format=gif`);
    const runSearch = await axios.get(`https://api.otakugifs.xyz/gif?reaction=run&format=gif`);
    const noSearch = await axios.get(`https://api.otakugifs.xyz/gif?reaction=no&format=gif`);
    const happySearch = await axios.get(`https://api.otakugifs.xyz/gif?reaction=happy&format=gif`);
    const slap = slapSearch.data['url'];
    const run = runSearch.data['url'];
    const no = noSearch.data['url'];
    const happy = happySearch.data['url'];

    //Filtro
    const filter = i => ['sim', 'não'].includes(i.customId) && i.user.id === usuario.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 60000, errors: ['time'] });

    //Caso o usuário tente duelar consigo mesmo;
    if(usuario.id === interaction.user.id) 
      return interaction.editReply({ content: 'Você não pode duelar consigo mesmo.', fetchReply: true })

    //Verificar se é número ou não;
    if(isNaN(coins))
      return interaction.editReply(`**${coins}** não é um número. \nCaso queira **duelar** digite **\`/duelar ${usuario.username}\`** um numero de **\`1\`** até **\`${self}\`**  **(Quantidade de Estrela(s) ⭐ que você possui em sua conta.)**`)

    //Caso o usuário tente duelar contra um bot;
    if(usuario.bot)
      return interaction.editReply(`Você não tem a menor chance contra **${usuario.username}** \nEscolha um usuário um humano que seja a sua altura.`);

    //Estrelas necessária para participar do Duelo;
    if(coins < 1)
      return interaction.editReply(`É necessário de **1 Estrela ⭐** para participa do **duelo*.`);

    //Caso o usuário não tenha Estrelas suficiente;
    if(self < coins) 
      return interaction.editReply(`Você não possui **${coins} ⭐** para duelar. \nReceba **Estrelas ⭐** acertando as respostas do **Quiz** ou subindo de **nível**.`);

    //Caso o inimigo não tenha Estrelas suficiente;
    if(adversario < coins) 
      return interaction.editReply(`**${interaction.user.username}**, **${usuario.username}** não possui **${coins} ⭐** para duelar. \nReceba **Estrelas ⭐** acertando as respostas do **Quiz** ou subindo de **nível**.`);

    //Coletor;
    collector.on('collect', async i => {

      //Botão - Sim
      if(i.customId === "sim") {

        embed.setTitle(`${usuario.username} aceitou o duelo!`)
        embed.setDescription(`
          O duelo vai começar em **5 segundo(s)**
          
          Enquanto os lutadores se preparam para lutar 
          compre uma **pipoca** na barraquinha do **Jori**. || Nerf Barbara ||`)
        embed.setImage()
        embed.setColor('#FFFFFF')
        embed.setFooter({ text: ' ' })

        //Remover Estrelas dos participantes.
        await points.subtract(`points_${interaction.user.id}`, coins);
        await points.subtract(`points_${usuario.id}`, coins);

        i.update({ embeds: [embed], components: [] }).then(interaction => {
          setTimeout(() => {

            embed.setTitle('A LUTA COMEÇOU!')
            embed.setDescription(`
              Quem será que vai vencer essa partida? 
              Será que vai ser **${membro.username}**? ou será **${usuario.username}**?

              **Hidari (Narrador)**: **${usuario.username}**, está bem confiante.
              Minha torcida vai para **${usuario.username}**`)
            embed.setImage(slap)
            embed.setColor('#A9F5A9')
            embed.setFooter({ text: 'Que luta meus amigos.' })
            i.followUp({ embeds: [embed], components: [] })

          }, 5000)
        }).then(interaction => {
                  setTimeout(() => {

          const knightsList = [membro.id, usuario.id];
          knightList = knightsList[Math.floor(Math.random() * knightsList.length)];

          embed.setTitle(`Temos um vencedor! ⚔️`)
          embed.setImage(happy)
          embed.setColor("#FFFFFF")
          embed.setFooter({ text: ' ' })

          //Check
          let checkUser = i.guild.members.cache.get(knightList);
          let boostCheck = checkUser.roles.cache.some(role => role.id === boostRole);

          //Aplicar Boost
          if(boostCheck) {
            //Adicionar Estrelas e XP para o vencedor [SUB];
            embed.setDescription(`
            <@${knightList}> venceu a batalha!
            Aqui está sua recompensa <@${knightList}>

            > **\`+\`** **${totalCoins} Estrela(s)** ⭐
            > **\`+\`** **200 Experiência** <:xp:990677571542843484>
            > **<@${knightList}>** Recebeu o dobro de **experiência** por está **BOOSTADO**. `)

            points.add(`points_${knightList}`, totalCoins);
            xp.add(`xp_${knightList}`, 100+100);
          } else {

            //Adicionar Estrelas e XP para o vencedor [FREE];
            embed.setDescription(`
            <@${knightList}> venceu a batalha!
            Aqui está sua recompensa <@${knightList}>

            > **\`+\`** **${totalCoins} Estrela(s)** ⭐
            > **\`+\`** **100 Experiência** <:xp:990677571542843484>`)

            points.add(`points_${knightList}`, totalCoins);
            xp.add(`xp_${knightList}`, 100);
          }
          i.followUp({ content: `|| <@${knightList}> ||`, embeds: [embed], components: [] })

          }, 10000)
        })
      }

      //Botão - Não
      if(i.customId === "não") {

        embed.setTitle(`${usuario.username} recusou o duelo!`)
        embed.setDescription(`Não foi dessa vez que tivemos uma briga entre **${usuario.username}** e **${interaction.user.username}**`)
        embed.setImage(no)
        embed.setColor('#CF2E2E')
        embed.setFooter({ text: 'ㅤ' })
        i.update({ embeds: [embed], components: [] })
        collector.stop()
      }
    })

    //Embed
    const embed = new EmbedBuilder()
    .setTitle(`${interaction.user.username} chamou ${usuario.username} para um duelo.`)
    .setDescription(`
    **${usuario.username}** foi chamado para **duelar** até a morte!
    Será que **${usuario.username}** vai correr? ou vai tentar da uma surra em **${interaction.user.username}**

    **💰 PREMIAÇÃO 💰**
    > **\`+\`** **${totalCoins} Estrela(s)** ⭐
    > **\`+\`** **100 Experiência** <:xp:990677571542843484>

    **ATENÇÃO**
    Apenas as **Estrela(s)** serão removidas da conta do perdedor.
    Experiência não será removida da conta do perdedor.`)
    .setColor(`#A9A9F5`)
    .setFooter({ text: `${usuario.username} você precisa selecionar um botão.` })

    //Botão
    let button = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('sim')
      .setLabel('Aceitar')
      .setStyle(ButtonStyle.Primary))
    .addComponents( new ButtonBuilder()
      .setCustomId('não')
      .setLabel('Recusar')
      .setStyle(ButtonStyle.Primary));

    interaction.editReply({ content: `||<@${interaction.user.id}>, <@${usuario.id}> ||`, embeds: [embed], components: [button] });

    //Embed - End
    const embedEnd = new EmbedBuilder()
    .setTitle('O tempo acabou!')
    .setDescription(`O tempo para **aceitar** ou **recusar** o **duelo** contra __**${interaction.user.username}**__ acabou!`)
    .setImage(run)
    .setColor('#CF2E2E')
    .setFooter({ text: ' ' })

    //Mensagem que será enviada quando o tempo acabar;
    collector.on('end', async i => {
      if(i.size < 1)
        return interaction.editReply({ embeds: [embedEnd], components: []});
    });
  },
};
