const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gif')
    .setDescription('[✂️] - Marque um amiguinho com algum gif.')
    .addUserOption(option => option
      .setName('usuário')
      .setDescription('Seleciona a pessoa que vai receber o gif.')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('categoria')
      .setDescription('Escolha uma categoria.')
      .setRequired(true)
      .addChoices(
        { name: 'Beijar', value: 'kiss' },
        { name: 'Carinho', value: 'pat' },
        { name: 'Aplaudir', value: 'clap' },
        { name: 'Dançar', value: 'dance' },
        { name: 'Chorando', value: 'cry' },
        { name: 'Soco', value: 'punch' },
        { name: 'Sonequinha', value: 'sleep' }
      )),
  async execute(interaction, message, client) {

      //Mensagem inicial;
      await interaction.reply('Selecionando uma imagem no banco de dados, aguarde.')
      interaction.deleteReply()

      //Usuário & Categoria;
      const usuario = await interaction.options.getUser('usuário');
      const target = await interaction.guild.members.fetch(usuario);
      const choice = interaction.options.getString('categoria');

      //Filtro
      const filter = i => ['devolver'].includes(i.customId);
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000, errors: ['time'] });

      //Buscandoa as imagens na API;
      const resultado = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${choice}&format=gif`);
      const gif = resultado.data['url']

      let download = new ActionRowBuilder()
      .addComponents( new ButtonBuilder()
        .setCustomId('devolver')
        .setLabel('Retribuir')
        .setStyle(ButtonStyle.Secondary))
      .addComponents( new ButtonBuilder()
        .setLabel('Abrir no navegador')
        .setURL(gif)
        .setStyle(ButtonStyle.Link));

//=============================================================================================================================//

      //Marcar sí próprio.
      if(target.id === interaction.user.id) {
        const embed = new EmbedBuilder()
        .setDescription('Continue se amando, todo mundo merece amar a sí próprio ❤️')
        .setImage(gif)
        .setColor("#FFFFFF")
        return interaction.channel.send({ content: `||${usuario}||`, embeds: [embed] })
      }

//=============================================================================================================================//

      //Embed kiss;
      if(choice === 'kiss'){

        //Embed;
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username} está beijando ${target.user.username}`)
        .setDescription(`**${target.user.username}** pelo visto **${interaction.user.username}** gosta de você! 🥰`)
        .setImage(gif)
        .setColor('#FFFFFF')

        //Função que vai enviar a mensagem;
        interaction.channel.send({ content: `|| ${usuario} ||`, embeds: [embed], components: [download] })
      }

//=============================================================================================================================//

      //Embed pat;
      if(choice === 'pat'){

        //Embed;
        const embed = new EmbedBuilder()
        .setTitle(`${target.user.username} tá merecendo um carinho o/`)
        .setDescription(`**${interaction.user.username}** está fazendo carinho em **${target.user.username}** 👀`)
        .setImage(gif)
        .setColor('#FFFFFF')

        //Função que vai enviar a mensagem;
        interaction.channel.send({ content: `||${usuario}||`, embeds: [embed], components: [download] })
      }

//=============================================================================================================================//
      
      //Embed clap;
      if(choice === 'clap'){

      //Embed;
        const embed = new EmbedBuilder()
        .setTitle(`${target.user.username} tá merecendo uns elogios 👏`)
        .setImage(gif)
        .setFooter({ text: `Enviado por: ${interaction.user.username}` })
        .setColor('#FFFFFF')

        //Função que vai enviar a mensagem;
        interaction.channel.send({ content: `||${usuario}||`, embeds: [embed], components: [download] })
      }

//=============================================================================================================================//
      
      //Embed dance;
      if(choice === 'dance'){

        //Embed;
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username} chamou ${target.user.username} para dançar 💃`)
        .setImage(gif)
        .setColor('#FFFFFF')

        //Função que vai enviar a mensagem;
        interaction.channel.send({ content: `||${usuario}||`, embeds: [embed], components: [download] })
      }

//=============================================================================================================================//
      
      //Embed cry;
      if(choice === 'cry'){

        //Embed;
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username} fez ${target.user.username} chorar`)
        .setDescription(`Vamo cobrar **${interaction.user.username}** por fazer **${target.user.username}** chorar. \nNão vamos deixar isso em vão, tropa do **sx** irá cobrar!`)
        .setImage(gif)
        .setColor('#FFFFFF')

        //Função que vai enviar a mensagem;
        interaction.channel.send({ content: `||${usuario}||`, embeds: [embed], components: [download] })
      }

//=============================================================================================================================//

      //Embed punch;
      if(choice === 'punch'){

        //Embed;
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username} está dando um soco em ${target.user.username}`)
        .setDescription(`**${target.user.username}** está sendo socado`)
        .setImage(gif)
        .setColor('#FFFFFF')

        //Função que vai enviar a mensagem;
        interaction.channel.send({ content: `||${usuario}||`, embeds: [embed], components: [download] })
      }

//=============================================================================================================================// 

      //Embed punch;
      if(choice === 'sleep'){

        //Embed;
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username} e ${target.user.username} estão dormindo juntinhos.`)
        .setImage(gif)
        .setColor('#FFFFFF')

        //Função que vai enviar a mensagem;
        interaction.channel.send({ content: `||${usuario}||`, embeds: [embed], components: [download] })
      }

//=============================================================================================================================//  

      //Collector;
      collector.on('collect', async i => {
        if(i.user.id === target.id) {
          if(i.customId === 'devolver'){

            //Buscandoa as imagens na API;
            const resultado = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${choice}&format=gif`);
            const gif_retribuir = resultado.data['url']

            //Tradução
            const translate = {
              "kiss": "o **beijo**",
              "pat": "o **carinho**",
              "dance": "pela **dança**",
              "clap": "pelos **elogios** o/",
              "cry": "por fazer ele(a) **chorar**. você é maldoso(a)",
              "punch": "o **soco** que você deu.",
              "sleep": "a soneca da tarde."
            }

            const embed = new EmbedBuilder()
            .setTitle(`**${target.user.username}** está retribuindo ${translate[choice]}`)
            .setImage(gif_retribuir)
            .setColor("#FFFFFF")
            i.reply({ content: `||<@${interaction.user.id}>||`, embeds: [embed] }).catch(err => console.log('Erro capturado.'))
          } 
        } else {
          i.reply({ content: 'Você não pode **retribuir gifs** que não foram enviados para você.', ephemeral: true }).catch(err => console.log(err))
        }
    })

    //Finalizando o evento de coleta
    collector.on('end', i => {
      console.log(`${i.size} interações foram coletadas`);
    });
  },
};
