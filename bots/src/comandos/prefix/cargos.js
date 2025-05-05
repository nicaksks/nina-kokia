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
        <:ACoin:988530798179270656> **𝐄𝐭𝐞𝐫𝐧𝐚𝐥 𝐑𝐞𝐭𝐮𝐫𝐧**
        ✦ Ative as configurações do **Eternal Return** para ficar por dentro de todas as
        informações do **Eternal Return** e dos **Sorteios** do canal! ( ´ ∀ ´)ノ～ 🔔

        <:Camera:992151233093718146> **𝐍𝐨𝐭𝐢𝐟𝐢𝐜𝐚𝐜𝐨𝐞𝐬 𝐝𝐚 𝐋𝐢𝐯𝐞**
        ✦ Ative as notifcações da live para saber quando a live estiver **online**! 
        ( ´ ∀ ´)ノ～ 🔔
        `)
    .setColor('#FFFFFF')

    //Button
    let button = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
    .setCustomId('cargos')
    .setLabel('𝐄𝐭𝐞𝐫𝐧𝐚𝐥 𝐑𝐞𝐭𝐮𝐫𝐧')
    .setEmoji('<:cliqueaqui:928852738509516850>')
    .setStyle(ButtonStyle.Secondary))
    .addComponents( new ButtonBuilder()
      .setCustomId('liveon')
      .setLabel('𝐍𝐨𝐭𝐢𝐟𝐢𝐜𝐚𝐜𝐨𝐞𝐬 𝐝𝐚 𝐋𝐢𝐯𝐞')
      .setEmoji('<:SkillIcon_1038500:992152458262478988>')
    .setStyle(ButtonStyle.Secondary));
    
   return message.channel.send({ embeds: [embed], components: [button] })  
    }

  //Erro ao executar o comando no canal errado 
   return message.reply(`Não é possível executar o comando **Cargos** nesse canal. \nAdicione os cargos no canal <#737035995400241163>`).then(message => {setTimeout(() => message.delete(), 10000)})
}
