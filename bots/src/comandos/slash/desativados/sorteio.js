const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sorteio')
    .setDescription('[✂️] - Codiguin? Okayge'),
  async execute(interaction, message, args, client) {

    if(!interaction.member.permissions.has("ADMINISTRATOR"))
      return interaction.reply({ content: `Apenas a **administração** tem acesso a esse comando.`, fetchReply: true })

    const role = interaction.guild.roles.cache.get('928853149043802142');
    const vencedor = role.members.random();

    await interaction.deferReply();
    await wait(3000);

    const sorteio = new EmbedBuilder()
    .setTitle(`❝꒰ Aceitas um Codiguin? 💌 ˎˊ˗`)
    .setDescription(`${vencedor} ganhou um **Codiguin** \nPara resgatar o seu **Codiguin** clique em __**RESGATAR**__. \n\nSorteio de **Codiguin** todos os meses!⋆｡˚`)
    .setImage('https://i.imgur.com/PPAII23.jpg')
    .setFooter({ text: '✧Patrocinado por ER Creator★' })
    .setColor('#FFFFFF')

    //Filtro
    const filter = i => i.customId === 'recompensa';

    //Collector
    const collector = interaction.channel.createMessageComponentCollector();
    collector.on('collect', async i => {
      if (i.customId === `${vencedor}`) {
            
      interaction.channel.send(`${vencedor}, **PARABÉNS** você foi o vencedor de um **Sorteio** no servidor da **nica** \nObrigada por me apoiar! Enviarei o seu **Codiguin** em breve. <:Heart:896304799736287242>`).catch(err => console.log('Problema de Interação no comando \'SORTEIO\''))           
    
      await i.deferUpdate();
      await wait(3000);  
      await i.editReply({ components: [noreward] })
    }
  });

    //Recompensa resgatada.
    let noreward = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
    .setCustomId('indisponivel')
    .setLabel('Essa recompensa já foi resgatada.')
    .setEmoji('<:Ico_Lock:927291017626021978>')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true));

    //Recompensa
    let reward = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
    .setCustomId(`${vencedor}`)
    .setLabel('Resgatar!')
    .setEmoji('<:resgatar:926259867763761154>')
    .setStyle(ButtonStyle.Secondary));

    await interaction.editReply({ content: `|| ${vencedor} ||`, embeds: [sorteio], components: [reward] })
  },
};
