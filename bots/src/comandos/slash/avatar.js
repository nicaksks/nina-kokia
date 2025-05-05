const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('[✂️] - Veja o seu Avatar ou Avatar de outros membros do servidor.')
    .addUserOption(option => option
      .setName('usuário')
      .setDescription('Veja a foto de um usuário')),
  async execute(interaction, client) {
    
    const target = await interaction.options.getUser('usuário') || client.users.cache.get(interaction.user.id) || interaction.user;
    const servidor = interaction.guild.members.cache.get(target.id);

    //Embed
    const embed = new EmbedBuilder()
    .setColor("#FFFFFF")

    try {
      servidor.displayAvatarURL();
   } catch (e) {
      embed.setTitle(`Foto do usuário ${target.username} (${target.username}#${target.discriminator})`)
      embed.setDescription(`Caso queira baixar a foto de **${target.username}** \nclique em uma das opções abaixo. \n\n__**FORMATOS DISPONÍVEIS**__ \n**[PNG](${target.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' })})**, **[JPG](${target.displayAvatarURL({ dynamic: true, size: 2048, format: 'jpg' })})** ou **[GIF](${target.displayAvatarURL({ dynamic: true, size: 2048, format: 'gif' })})**`)
      embed.setImage(target.displayAvatarURL({ dynamic: true, size: 2048 }))
      return interaction.reply({ embeds: [embed] });
    }

    //Filtro
    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

    collector.on('collect', async i => {

      if(i.customId === 'servidor') {
        if(target.id === interaction.user.id) {
          embed.setDescription(`Caso queira baixar a sua foto \nclique em uma das opções abaixo. \n\n__**FORMATOS DISPONÍVEIS**__ \n**[PNG](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' })})**, **[JPG](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'jpg' })})** ou **[GIF](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'gif' })})**`)
          embed.setImage(`${servidor.displayAvatarURL({ dynamic: true, size: 2048 })}`)
          i.update({ embeds: [embed], components: [button] });
          collector.stop();
        } else {
          embed.setTitle(`${interaction.member.displayName} pelo visto gostou da foto de ${target.username}`)
          embed.setDescription(`Caso queira baixar a foto de **${target.username}** \nclique em uma das opções abaixo. \n\n__**FORMATOS DISPONÍVEIS**__ \n**[PNG](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' })})**, **[JPG](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'jpg' })})** ou **[GIF](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'gif' })})**`)
          embed.setImage(`${servidor.displayAvatarURL({ dynamic: true, size: 2048 })}`)
          i.update({ embeds: [embed], components: [button] });
          collector.stop();
        }
      }

      if(i.customId === "global") {
        if(target.id === interaction.user.id) {
          embed.setDescription(`Caso queira baixar a sua foto \nclique em uma das opções abaixo. \n\n__**FORMATOS DISPONÍVEIS**__ \n**[PNG](${target.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' })})**, **[JPG](${target.displayAvatarURL({ dynamic: true, size: 2048, format: 'jpg' })})** ou **[GIF](${target.displayAvatarURL({ dynamic: true, size: 2048, format: 'gif' })})**`)
          embed.setImage(`${target.displayAvatarURL({ dynamic: true, size: 2048 })}`)
          i.update({ embeds: [embed], components: [button] });
          collector.stop();
        } else {
          embed.setTitle(`${interaction.member.displayName} pelo visto gostou da foto de ${target.username}`)
          embed.setDescription(`Caso queira baixar a foto de **${target.username}** \nclique em uma das opções abaixo. \n\n__**FORMATOS DISPONÍVEIS**__ \n**[PNG](${target.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' })})**, **[JPG](${target.displayAvatarURL({ dynamic: true, size: 2048, format: 'jpg' })})** ou **[GIF](${target.displayAvatarURL({ dynamic: true, size: 2048, format: 'gif' })})**`)
          embed.setImage(`${target.displayAvatarURL({ dynamic: true, size: 2048 })}`)
          i.update({ embeds: [embed], components: [button] });
          collector.stop();
        }
      }
    })

    if(target.id === interaction.user.id) {
      embed.setTitle(`${interaction.member.displayName} aqui está sua foto.`)
      embed.setDescription(`Caso queira baixar a sua foto \nclique em uma das opções abaixo. \n\n__**FORMATOS DISPONÍVEIS**__ \n**[PNG](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' })})**, **[JPG](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'jpg' })})** ou **[GIF](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'gif' })})**`)
      embed.setImage(`${servidor.displayAvatarURL({ dynamic: true, size: 2048 })}`)
    } else {
      embed.setTitle(`${interaction.member.displayName} pelo visto gostou da foto de ${target.username}`)
      embed.setDescription(`Caso queira baixar a foto de **${target.username}** \nclique em uma das opções abaixo. \n\n__**FORMATOS DISPONÍVEIS**__ \n**[PNG](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' })})**, **[JPG](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'jpg' })})** ou **[GIF](${servidor.displayAvatarURL({ dynamic: true, size: 2048, format: 'gif' })})**`)
      embed.setImage(`${servidor.displayAvatarURL({ dynamic: true, size: 2048 }) || url}`)
    }

    //Botão
    let button = new ActionRowBuilder()
    .addComponents( new ButtonBuilder()
      .setCustomId('servidor')
      .setLabel('Avatar no Servidor')
      .setStyle(ButtonStyle.Secondary))
    .addComponents( new ButtonBuilder()
      .setCustomId('global')
      .setLabel('Avatar Global')
      .setStyle(ButtonStyle.Primary));

    //Verificar se o Avatar Global é igual o do servidor;

    const sAvatar = servidor.displayAvatarURL();
    const gAvatar = target.displayAvatarURL();
    gAvatar === sAvatar ? interaction.reply({ embeds: [embed] }) : interaction.reply({ embeds: [embed], components: [button] });

  },
};