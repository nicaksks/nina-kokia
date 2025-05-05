const client = require('../..');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../../src/util/config.json');
const role = config['autoRole'][0].role;
const welcome = config['autoRole'][0].welcome;

client.on("ready", () => {
  client.on("guildMemberAdd", async (member, message, client) => {
    
      //Auto Role
      const Convidado = await member.guild.roles.cache.get(role);
      member.roles.add(Convidado).catch(error => console.log('...'))

      //Botões de 'Acene, para dizer olá!
      const welcome = new ActionRowBuilder()
      .addComponents( new ButtonBuilder()
      .setCustomId('hello')
      .setLabel('Acene para dizer olá!')
      .setEmoji('<a:peepoHey:822379826547654717>')
      .setStyle(ButtonStyle.Secondary));   

      //Mensagem de boas vindas.
      const newmember = new EmbedBuilder()
      .setDescription(`
      <a:heartpinkpuff:922924481058586654> Bem vindo a 𓂃 nica ˖ ⊹
      <:pin:922924480442036264> ・ 𐐪𐑂︰<#737035995400241163>
      <:planet:922924013330792448>  ・ 𐐪𐑂︰ <#922509168290701332>
      <:milk:922923570340978738>  ・ 𐐪𐑂︰<#994788562862080141>    `)
      .setColor('#FFFFFF')

      try {
        member.guild.channels.cache.get("737035995400241164").send({ content: `|| <@${member.id}> ||`, components: [welcome], embeds: [newmember] })
      } catch(e){
        console.log('...')
      }
  })
});