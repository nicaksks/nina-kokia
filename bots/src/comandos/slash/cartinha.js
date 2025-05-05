const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cartinha')
    .setDescription('[✂️] - Envie uma cartinha para um pessoa que você goste.')
    .addUserOption(option => option
      .setName('usuário')
      .setDescription('Seleciona a pessoa que vai receber cartinha.')
      .setRequired(true))
    .addStringOption(option => option
      .setName('mensagem')
      .setDescription('Escreva uma mensagem.')
      .setRequired(true)),
    async execute(interaction, message, client) {

      await interaction.reply('Correio está chegando.')
      interaction.deleteReply()

      //Usuário & Mensagem;
      const usuario = await interaction.options.getUser('usuário');
      const mensagem = await interaction.options.getString('mensagem');

      //Embed - Enviada
      const enviado = new EmbedBuilder()
      .setTitle('📬 Correio do Servidor')
      .addFields({ name: "✉️ Para", value: `${usuario}` })
      .addFields({ name: "💌 Mensagem", value: `${mensagem}` })
      .setThumbnail('https://i.imgur.com/dmyUOxi.png')
      .setColor("#FFFFFF")

      await interaction.channel.send({ content: `|| ${usuario} ||`, embeds: [enviado] })
  },

};