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
        <:PepegiGift:1030302694910468206> **Emote Drop**
        ✦ Ative as configurações do **Emote Drop** para saber quando que os **strumers**
        vão ficar online na **Twitch**! ( ´ ∀ ´)ノ～ 🔔
        `)
    .setColor('#FFFFFF')

    //Button
    let button = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
    .setCustomId('strumers')
    .setLabel(`✦ ❝ ઇ Emote Drop ⸝⸝ ⸼`)
    .setEmoji('<:PepegiGift:1030302694910468206>')
    .setStyle(ButtonStyle.Secondary));
    
   return message.channel.send({ embeds: [embed], components: [button] })  
    }

  //Erro ao executar o comando no canal errado 
   return message.reply(`Não é possível executar o comando **Cargos** nesse canal. \nAdicione os cargos no canal <#737035995400241163>`).then(message => {setTimeout(() => message.delete(), 10000)})
}
