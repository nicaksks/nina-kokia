const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const sonoplastia = require('../../../src/assets/audios/sonoplastia');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sonoplastia')
    .setDescription('[✂️] - Sonoplastia do Ratinho e amigos.')
    .addStringOption(option =>
      option.setName('som')
      .setDescription('Escolha uma som.')
      .setRequired(true)
      .addChoices(
        { name: 'Esse é meu patrão', value: 'patrao' },
        { name: 'Tome', value: 'tome' },
        { name: 'Uiii', value: 'ui' },
        { name: 'Dança gatinho, dança', value: 'gatinho' },
        { name: 'Ele gosta', value: 'elegosta' },    
        { name: 'Que é isso meu filho calma', value: 'calma' },
        { name: 'Ai que delicia', value: 'delicia' },
        { name: 'Rapaz', value: 'rapaz' },
        { name: 'Fortnite', value: 'fortnite' },
        { name: 'Cala boca puta', value: 'puta' },
        { name: 'Cavalo', value: 'cavalo' },
        { name: 'Demais', value: 'demais' }
      )),
  async execute(interaction, message, client) {

      const choice = interaction.options.getString('som');

      const nome = sonoplastia[choice][choice]
      const audio = sonoplastia[choice]['link']
      const nomedoAudio = sonoplastia[choice]['nome']

      if(!interaction.member.voice?.channel) return interaction.reply(`Entre em um **canal de voz** para poder escutar **\`${nomedoAudio}\`**`);

      if(choice === nome) {
        const connection = joinVoiceChannel({
          channelId: interaction.member.voice.channel.id,
          guildId: interaction.channel.guild.id,
          adapterCreator: interaction.channel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(audio);

        player.play(resource);
        connection.subscribe(player);

        await interaction.reply({ content: `**\`${nomedoAudio}\`** está tocando no canal **\`${interaction.member.voice.channel.name}\`**`, ephemeral: true })

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });
      }
  },
};
