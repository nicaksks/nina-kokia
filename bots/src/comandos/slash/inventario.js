const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const db = require("quick.db")
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventario')
    .setDescription('[✂️] - Veja os itens do seu inventário.'),
  async execute(interaction, message, client) {
    
    await interaction.deferReply();

    let membro = interaction.user
    let saldo = db.fetch(`chaves_${membro.id}`)
    if (saldo < 1) {
      saldo = 0
    }

    let itens = new db.table('itens')

    //Codiguin | ID: 1
    let codiguin = itens.fetch(`1_${membro.id}`)
    if (codiguin < 1) {
      codiguin = 0
    }

    //VIP | ID: 2
    let vip = itens.fetch(`2_${membro.id}`)
    if (vip < 1) {
      vip = 0
    }

    //Korhal | ID: 4
    let korhal = itens.fetch(`4_${membro.id}`)
    if (korhal < 1) {
      korhal = 0
    }

    //Timeout | ID: 5
    let timeout = itens.fetch(`5_${membro.id}`)
    if (timeout < 1) {
      timeout = 0
    }

    //Reembolso | ID: 7
    let reembolso = itens.fetch(`7_${membro.id}`)
    if (reembolso < 1) {
      reembolso = 0
    }

    //Embed principal.
    const embed = new EmbedBuilder()
    .setTitle(`Inventário de ${interaction.user.username}`)
    .setDescription(`
      **${interaction.user.username}**, aqui está todos os itens do seu inventário.
      Caso queira abrir mais **espólios**, compre mais <:key:927744143214649404> com suas **essência azuis** no canal da __**[nica](https://twitch.tv/anniesemtrema)**__ na twitch.

      Atualmente você possui  **${saldo}** <:key:927744143214649404>
      Caso queira abrir **espólios** use o comando **/espolios**`)
    .addFields({ name: "Nome da recompensa", value: `
      Codiguin
      VIP
      Timeout no Korhal
      Timeout
      Reembolso`, inline: true})
    .addFields({ name: "Quantidade", value: `
      ㅤㅤ${codiguin}
      ㅤㅤ${vip}
      ㅤㅤ${korhal}
      ㅤㅤ${timeout}
      ㅤㅤ${reembolso}`, inline: true })
    .addFields({ name: "** **", value: `
      Você pode resgatar suas recompensas através do atalhos rápidos que ficam em baixo da **embed.**
      O atalho rápido sempre mostra as melhores recompensas do **espólio**.`, inline: false })
    .setColor("#FFFFFF")


    //Confirmado.
    const confirm = new EmbedBuilder()
    .setDescription("Você tem certeza que quer Resgatar essa recompensa?")
    .setColor("#FF9E00")

    //Error.
    const error = new EmbedBuilder()
    .setDescription("Você não possui esse item em seu inventário.")
    .setColor("#FF0000")

    //Sucesso.
    const sucess = new EmbedBuilder()
    .setDescription("Recompensa resgatada com sucesso.")
    .setColor("#3CFF33")

    //Botão do codiguin.
    const buttons = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('codiguin-id')
      .setLabel('Codiguin')
      .setStyle(ButtonStyle.Primary))
    .addComponents( new ButtonBuilder()
      .setCustomId('vip-id')
      .setLabel('VIP')
      .setStyle(ButtonStyle.Primary))
    .addComponents( new ButtonBuilder()
      .setCustomId('korhal-id')
      .setLabel('Korhal')
      .setStyle(ButtonStyle.Primary))
    .addComponents( new ButtonBuilder()
      .setCustomId('timeout-id')
      .setLabel('Timeout')
      .setStyle(ButtonStyle.Primary))
    .addComponents( new ButtonBuilder()
      .setCustomId('reembolso-id')
      .setLabel('Reembolso')
      .setStyle(ButtonStyle.Primary));

    const confirmed = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('Sim!')
      .setStyle(ButtonStyle.Success))
    .addComponents( new ButtonBuilder()
      .setCustomId('no')
      .setLabel('Não!')
      .setStyle(ButtonStyle.Danger));

    const confirmed1 = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('yes-vip')
      .setLabel('Sim!')
      .setStyle(ButtonStyle.Success))
    .addComponents( new ButtonBuilder()
      .setCustomId('no-vip')
      .setLabel('Não!')
      .setStyle(ButtonStyle.Danger));

    const confirmed2 = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('yes-korhal')
      .setLabel('Sim!')
      .setStyle(ButtonStyle.Success))
    .addComponents( new ButtonBuilder()
      .setCustomId('no-korhal')
      .setLabel('Não!')
      .setStyle(ButtonStyle.Danger));

    const confirmed3 = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('yes-timeout')
      .setLabel('Sim!')
      .setStyle(ButtonStyle.Success))
    .addComponents( new ButtonBuilder()
      .setCustomId('no-timeout')
      .setLabel('Não!')
      .setStyle(ButtonStyle.Danger));

    const confirmed4 = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('yes-reembolso')
      .setLabel('Sim!')
      .setStyle(ButtonStyle.Success))
    .addComponents( new ButtonBuilder()
      .setCustomId('no-reembolso')
      .setLabel('Não!')
      .setStyle(ButtonStyle.Danger));

    const home = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('home-id')
      .setLabel('Início')
      .setStyle(ButtonStyle.Primary));

    const home1 = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('home-id1')
      .setLabel('Início')
      .setStyle(ButtonStyle.Primary));

    const home2 = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('home-id2')
      .setLabel('Início')
      .setStyle(ButtonStyle.Primary));

    const home3 = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('home-id3')
      .setLabel('Início')
      .setStyle(ButtonStyle.Primary));

    const home4 = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('home-id4')
      .setLabel('Início')
      .setStyle(ButtonStyle.Primary));

//--------------------------------------------------------------------------------------------------------------------------------------------

    const f0 = i => ['codiguin-id', 'yes', 'no', 'home-id', 'vip-id', 'yes-vip'].includes(i.customId) && i.user.id === interaction.user.id; 
    const collector = interaction.channel.createMessageComponentCollector({ filter: f0, time: 15000 });
    
    const f1 = i => ['vip-id', 'yes-vip', 'no-vip', 'home-id1'].includes(i.customId) && i.user.id === interaction.user.id;
    const collector1 = interaction.channel.createMessageComponentCollector({ filter: f1, time: 15000 });
   
    const f2 = i => ['korhal-id', 'yes-korhal', 'no-korhal', 'home-id2'].includes(i.customId) && i.user.id === interaction.user.id;
    const collector2 = interaction.channel.createMessageComponentCollector({ filter: f2, time: 15000 });
    
    const f3 = i => ['timeout-id', 'yes-timeout', 'no-timeout', 'home-id3'].includes(i.customId) && i.user.id === interaction.user.id;
    const collector3 = interaction.channel.createMessageComponentCollector({ filter: f3, time: 15000 });
   
    const f4 = i => ['reembolso-id', 'yes-reembolso', 'no-reembolso', 'home-id4'].includes(i.customId) && i.user.id === interaction.user.id;
    const collector4 = interaction.channel.createMessageComponentCollector({ filter: f4, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === "codiguin-id") {
        const resgatar = itens.fetch(`1_${membro.id}`)
        if (resgatar < 1) {
          await i.update({ embeds: [error], components: [home] })
        } else {
          await i.update({ embeds: [confirm], components: [confirmed] })
        }

      } if (i.customId === "yes") {
      const resgatar = itens.fetch(`1_${membro.id}`)
      if (resgatar < 1) {
        await i.update({ embeds: [error] })
      } else {
      sucess.setDescription('Você resgatou um **Codiguin** com sucesso.')
      await i.update({ embeds: [sucess], components: [home] })
      return itens.subtract(`1_${membro.id}`, 1) 
    }
  }
    if (i.customId === "no") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    if (i.customId === "home-id") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    })

//--------------------------------------------------------------------------------------------------------------------------------------------

    collector1.on('collect', async i => {
      if (i.customId === "vip-id") {
        const resgatar_vip = itens.fetch(`2_${membro.id}`)
        if (resgatar_vip < 1) {
          await i.update({ embeds: [error], components: [home1] })
        } else {
          await i.update({ embeds: [confirm], components: [confirmed1] })
        }

      } if (i.customId === "yes-vip") {
      const resgatar_vip = itens.fetch(`2_${membro.id}`)
      if (resgatar_vip < 1) {
        await i.update({ embeds: [error] })
      } else {
      sucess.setDescription('Você resgatou um **VIP** com sucesso.')
      await i.update({ embeds: [sucess], components: [home1] })
      return itens.subtract(`2_${membro.id}`, 1) 
    }
  }
    if (i.customId === "no-vip") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    if (i.customId === "home-id1") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    })

//--------------------------------------------------------------------------------------------------------------------------------------------

    collector2.on('collect', async i => {
      if (i.customId === "korhal-id") {
        const resgatar_korhal = itens.fetch(`4_${membro.id}`)
        if (resgatar_korhal < 1) {
          await i.update({ embeds: [error], components: [home2] })
        } else {
          await i.update({ embeds: [confirm], components: [confirmed2] })
        }

      } if (i.customId === "yes-korhal") {
      const resgatar_korhal = itens.fetch(`4_${membro.id}`)
      if (resgatar_korhal < 1) {
        await i.update({ embeds: [error] })
      } else {
      sucess.setDescription('Você resgatou um timeout no **Korhal** com sucesso.')
      await i.update({ embeds: [sucess], components: [home2] })
      return itens.subtract(`4_${membro.id}`, 1) 
    }
  }
    if (i.customId === "no-korhal") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    if (i.customId === "home-id2") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    })

//--------------------------------------------------------------------------------------------------------------------------------------------

    collector3.on('collect', async i => {
      if (i.customId === "timeout-id") {
        const resgatar_timeout = itens.fetch(`5_${membro.id}`)
        if (resgatar_timeout < 1) {
          await i.update({ embeds: [error], components: [home3] })
        } else {
          await i.update({ embeds: [confirm], components: [confirmed3] })
        }

      } if (i.customId === "yes-timeout") {
      const resgatar_timeout = itens.fetch(`5_${membro.id}`)
      if (resgatar_timeout < 1) {
        await i.update({ embeds: [error] })
      } else {
      sucess.setDescription('Você resgatou um **Timeout** com sucesso.')
      await i.update({ embeds: [sucess], components: [home3] })
      return itens.subtract(`5_${membro.id}`, 1) 
    }
  }
    if (i.customId === "no-timeout") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    if (i.customId === "home-id3") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    })


//--------------------------------------------------------------------------------------------------------------------------------------------

    collector4.on('collect', async i => {
      if (i.customId === "reembolso-id") {
        const resgatar_reembolso = itens.fetch(`7_${membro.id}`)
        if (resgatar_reembolso < 1) {
          await i.update({ embeds: [error], components: [home4] })
        } else {
          await i.update({ embeds: [confirm], components: [confirmed4] })
        }

      } if (i.customId === "yes-reembolso") {
      const resgatar_reembolso = itens.fetch(`7_${membro.id}`)
      if (resgatar_reembolso < 1) {
        await i.update({ embeds: [error] })
      } else {
      sucess.setDescription('Você foi **Reembolsado** com sucesso.')
      await i.update({ embeds: [sucess], components: [home4] })
      itens.subtract(`7_${membro.id}`, 1)
      return db.add(`chaves_${membro.id}`, 1)
    }
  }
    if (i.customId === "no-reembolso") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    if (i.customId === "home-id4") {
      await i.update({ embeds: [embed], components:[buttons] })
      }

    })

//--------------------------------------------------------------------------------------------------------------------------------------------

    wait(5000)
    await interaction.editReply({ embeds: [embed], components: [buttons] })
  },
};
