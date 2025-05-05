const client = require('../..');
const config = require('../../../src/util/config.json');
const db = require('quick.db');

client.on("interactionCreate", async (interaction) => {

  if (interaction.isButton()) {

    const verificar = new db.table('verificar');
    
    //Hello
    if (interaction.customId === 'hello') {

        const checkUser = verificar.get(`welcome_${interaction.user.id}`);
        if(checkUser) 
          return interaction.reply({ content: 'Você já deu olá para o chat.', ephemeral: true });
        
        await interaction.reply({ content: 'ㅤ', ephemeral: false })
        interaction.deleteReply()

        interaction.guild.channels.cache.get("994788562862080141").send(`<@${interaction.member.id}>, está dizendo **\`olá\`** para o chat. <a:peepoShy:817435326967709746>`)
        interaction.guild.channels.cache.get("994788562862080141").send('<a:peepoHey:822379826547654717>')
        verificar.add(`welcome_${interaction.user.id}`, 1);
      }
    
    //Sorteio
    if (interaction.customId === 'sorteio') {
        client.users.cache.get('226393792335314945').send(`Ei,<@226393792335314945> \n<@${interaction.member.id}> ganhou o sorteio do **Codiguin!** \nTeria como enviar o **Codiguin** para <@${interaction.member.id}>?`)
      }

    //ER
    if (interaction.customId == "cargos") {
      const er = '928853149043802142';

      //Remover o Cargo    
      if (interaction.member.roles.cache.some((role) => role.id == er)) {
        interaction.reply({ content: `Notificações de anúncios do **Eternal Return:** \`DESATIVADO\``, ephemeral: true });
        interaction.member.roles.remove(er);
      } else {
        //Adicionar o Cargo  
        interaction.member.roles.add(er);
        await interaction.reply({ content: `Notificações de anúncios do **Eternal Return:** \`ATIVADO\``, ephemeral: true});
      }
    }    

    //LIVE ON
    if (interaction.customId == "liveon") {
      const liveon = '992148249760763924';  
            
      //Remover o Cargo    
      if (interaction.member.roles.cache.some((role) => role.id == liveon)) {
        interaction.reply({ content: `Notificações de anúncios da live foram \`DESATIVADOS\``, ephemeral: true });
        interaction.member.roles.remove(liveon);
      } else {
        //Adicionar o Cargo  
        interaction.member.roles.add(liveon);
        await interaction.reply({ content: `Notificações de anúncios da live \`ATIVADO\``, ephemeral: true});
      }
    }   

    //Streamers
    if (interaction.customId == "strumers") {
    const strumers = '999636393355657267';  
            
    //Remover o Cargo    
    if (interaction.member.roles.cache.some((role) => role.id == strumers)) {
      interaction.reply({ content: `Notifcações de **DROP de Emote** \`DESATIVADOS\``, ephemeral: true });
      interaction.member.roles.remove(strumers);
    } else {
    
      //Adicionar o Cargo  
      interaction.member.roles.add(strumers);
      await interaction.reply({ content: `Notifcações de **DROP de Emote** \`ATIVADO\``, ephemeral: true});
      }
    } 
  };
})