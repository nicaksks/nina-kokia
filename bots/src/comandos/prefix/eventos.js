const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.run = (client, message) => {  

    //Deletar o comando enviado
    setTimeout(() => message.delete(), 5000) 

    //Permissões
    if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.reply(`Apenas a **ADMINISTRAÇÃO** do servidor da **nica** tem a **permissão** para executar esse comando.`).then(message => {setTimeout(() => message.delete(), 10000)});

    //Canal que o comando pode ser executado
    if(message.channel.id === `737035995400241163`) { 

    //Embed
    const embed = new EmbedBuilder()
    .setDescription(`
        <:Coracao:988530135059816520> **𝐃𝐑𝐎𝐏 𝐃𝐄 𝐄𝐌𝐎𝐓𝐄**
        ✦ Ative as configurações de **Drop de Emote** para saber quantos os **Streamers** 
        que estiverem dropando os **emotes** estiverem online. ( ´ ∀ ´)ノ～ 🔔
        `)
    .setColor('#FFFFFF')

    //Button
    let button = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
    .setCustomId('strumers')
    .setLabel('𝐃𝐑𝐎𝐏 𝐃𝐄 𝐄𝐌𝐎𝐓𝐄')
    .setEmoji('<:Coracao:988530135059816520>')
    .setStyle(ButtonStyle.Secondary));
   return message.channel.send({ embeds: [embed], components: [button] })  
    }

  //Erro ao executar o comando no canal errado 
   return message.reply(`Não é possível executar o comando **Eventos** nesse canal. \nAdicione os cargos no canal <#737035995400241163>`).then(message => {setTimeout(() => message.delete(), 10000)
   })
}

