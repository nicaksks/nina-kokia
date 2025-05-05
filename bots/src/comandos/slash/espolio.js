const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const wait = require('util').promisify(setTimeout);
const db = require("quick.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('espolio')
    .setDescription('[✂️] - Abra um baú com seus pontos da live.'),
  async execute(interaction, message, client) {

    let membro = interaction.user
    let usuario = db.fetch(`chaves_${membro.id}`)
    if (usuario < 1) {
      return interaction.reply('Você não possui nenhuma <:key:927744143214649404> em seu inventário. \nCompre <:key:927744143214649404> através da live na **nica** com suas **Essências Azuis**.')
    }

    //Filtro
    const filter = i => ['resgatar', 'tabela'].includes(i.customId) && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, max: 4, time: 10000 });

collector.on('collect', async i => {
    if (i.customId === `resgatar`) {

      let chaves = db.subtract(`chaves_${membro.id}`, 1)

      //Nome das recompensas + Porcentagem
      const extra = [
      {id: 'chaves_', nome: "**| `+1`** <:key:927744143214649404>",  porcentagem: 5},
      {nome: "** **",  porcentagem: 95}
      ];

      //Nome das recompensas + Porcentagem
      const recompensas = [
      {id: 1, nome: "Codiguin", porcentagem: 1},
      {id: 2, nome: "VIP",  porcentagem: 1},
      {id: 3, nome: "Asmr da nica (Scam)", porcentagem: 8},
      {id: 4, nome: "Banir o Korhal por 1 minuto(s).",   porcentagem: 10},
      {id: 5, nome: "Escolha uma pessoa para tomar timeout de 2 minutos", porcentagem: 20},    
      {id: 6, nome: 'Nada', porcentagem: 30},
      {id: 7, nome: 'Reembolso', porcentagem: 30}
      ];

      //Baú + Chave extra.
      const bau = extra.flatMap(extras => Array(extras.porcentagem).fill(extras));
      const chave = bau[Math.floor(Math.random() * bau.length)];  

      //Sorteio + Vencedor
      const sorteio = recompensas.flatMap(recompensa => Array(recompensa.porcentagem).fill(recompensa));
      const vencedor = sorteio[Math.floor(Math.random() * sorteio.length)];

      //Embed abrindo.
      const attachment = new AttachmentBuilder("src/assets/espolio/gif.gif") 
      const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username} está abrindo um Baú`)
      .setDescription(`
      O que será que **${interaction.user.username}** irá ganhar? 👀 
      
      Caso queria abrir um **baú** compre uma **chave** <:key:927744143214649404>
      com os seus pontos de canal, no canal da **[nica](https://www.twitch.tv/anniesemtrema)**`)
      .setImage(`attachment://gif.gif`)
      .setColor("#FFFFFF")

      //
      const embed1 = new EmbedBuilder()
      .setTitle(`${interaction.user.username}, aqui está sua recompensa! 🎉`)
      .setDescription(`
      Obrigada por apoiar a **nica**!
      Aqui está sua recompensa: **${vencedor.nome}** ${chave.nome}`)
      .setColor("#FFFFFF")

      await i.update({ embeds: [embed], components: [], files: [attachment] }).then((interaction)=> {
        setTimeout(function(){
          i.editReply({ embeds: [embed1], files: [] })
        
      //Itens cadastrado no banco de dados.
      let itens = new db.table('itens')
      itens.add(`${vencedor.id}_${membro.id}`, 1)

      //Chave adicional
      db.add(`${chave.id}${membro.id}`, 1)
      collector.stop()

  }, 2800)
})
    await wait(2500);
    }    

    //Tabela
    if (i.customId === `tabela`) {  

    const embed = new EmbedBuilder()
    .setTitle(`TABELA DAS PORCENTAGENS`)
    .setDescription(`
    Codiguin - **1%**
    VIP - **1%**
    Timeout no Korhal - **10%**
    Asmr da nica - **8%** 
    Timeout de sua escolha - **20%**
    Nada - **30%**
    Reembolso - **4%** 

    **CHAVE EXTRA** 
    Chance: **5%**  
      `)
    .setColor("#FFFFFF") 

    await i.update({ embeds: [embed], components: [resgatar], files: [] })
  }

});

    //Resgatar
    let resgatar = new ActionRowBuilder()
    .addComponents(new ButtonBuilder()
    .setCustomId(`resgatar`)
    .setLabel('Abrir baú')
    .setEmoji('<:key:927744143214649404>')
    .setStyle(ButtonStyle.Secondary),
    ).addComponents(new ButtonBuilder()
    .setCustomId(`tabela`)
    .setLabel('Tabela')
    .setEmoji('<:tabela:927834591899815936>')
    .setStyle(ButtonStyle.Secondary));    

    const after = usuario - 1
    const attachment = new AttachmentBuilder("src/assets/espolio/chest.png")
    const embed = new EmbedBuilder()
    .setTitle(`Gostaria de abrir uma caixa?`)
    .setDescription(`
    Para abrir uma caixa custa **1** chave <:key:927744143214649404> 
    Atualmente você possui **${usuario}** chave(s) <:key:927744143214649404>
    Depois de abrir uma caixa você vai ficar com **${after}** chave(s) <:key:927744143214649404>`)
    .setImage('attachment://chest.png')
    .setColor("#FFFFFF")

 interaction.reply({ embeds: [embed] , components: [resgatar], files: [attachment] })
  },

};