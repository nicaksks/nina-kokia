const { EmbedBuilder } = require('discord.js');
const client = require('../..');

client.on('ready', () => {

  setInterval(async () => {

    //Guild and Role
    const guild = client.guilds.cache.get('737035994494140517')
    var participantes = guild?.roles.cache.get('928853149043802142')?.members.size || 'nenhum participante.'

    //Embed Inicial
    const embed = new EmbedBuilder()
    .setTitle('𝐒𝐨𝐫𝐭𝐞𝐢𝐨 𝐦𝐞𝐧𝐬𝐚𝐥 𝐝𝐞 𝐂𝐨𝐝𝐢𝐠𝐮𝐢𝐧!')
    .setDescription(`
    ✦ Participe mensalmente de sorteios aqui no discord da live ou no canal da twitch! (★ω★)/
    ✦ Para participar dos sorteios mensais do canal é necessário pegar o cargo <@&928853149043802142> na sala <#737035995400241163>
        `)
    .addFields({ name: '** **', value: '** **', inline: true })
    .addFields({ name: 'ㅤㅤㅤㅤㅤㅤ꒰ 𝐏𝐀𝐑𝐓𝐈𝐂𝐈𝐏𝐀𝐍𝐓𝐄𝐒 ꒱', value: ` Atualmente tem **${participantes}** cobaias participando ヽ(>∀<☆)ノ`, inline: true })
    .addFields({ name: '** **', value: '** **', inline: true })    
    .setColor('#FFFFFF')
    
    try {
      await client.channels.cache.get(`926200513786183710`).send({ embeds: [embed] }).then(message => { setTimeout(() => message.delete().catch(error => console.log(`[Sorteio] - Erro ao deletar a Embed de Sorteio.`)), 60000)})  
    } catch(e) {
      console.log('Problema ao enviar a embed de sorteio.')
    } 
  }, 60000)
  
});