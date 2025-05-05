const client = require('../..');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js'); 

async function presidente() {

    const presidente = await axios.get('https://resultados.tse.jus.br/oficial/ele2022/545/dados-simplificados/br/br-c0001-e000545-r.json')
    .then(response => response.data);

    const cand1 = presidente.cand[0];
    const cand2 = presidente.cand[1];

    const embed = new EmbedBuilder()
    .setTitle(`👑 Possível próximo Presidente: ${cand1.nm}`)
    .addFields({ name: `${cand1.nm} | ${cand1.cc.split(' ')[0]} - ${cand1.n}`, value: `Votos: **${new Intl.NumberFormat('de-DE', { maximumSignificantDigits: 20 }).format(cand1.vap)} - ${cand1.pvap}%**`, inline: true })
    .addFields({ name: `${cand2.nm} | ${cand2.cc.split(' ')[0]} - ${cand2.n}`, value: `Votos: **${new Intl.NumberFormat('de-DE', { maximumSignificantDigits: 20 }).format(cand2.vap)} - ${cand2.pvap}%**`, inline: true })
    .addFields({ name: 'ㅤ', value: `➜ **${new Intl.NumberFormat('de-DE', { maximumSignificantDigits: 20 }).format(presidente.vnom)} votos - ${presidente.pst}%** das seções totalizadas. \n\n👑 **${cand1.nm}** está liderando com **${new Intl.NumberFormat('de-DE', { maximumSignificantDigits: 20 }).format(cand1.vap)} votos - ${cand1.pvap}%** \n➜ **${cand1.nm}** será o possível novo **Presidente**`, inline: false })
    .setFooter({ text: `Última atualização: ${presidente.dg} - ${presidente.hg} (Horário local)`})
    .setColor('#FFFFFF')
    await client.channels.cache.get(`1036377045833359441`).send({ embeds: [embed] })
    .then(message => { setTimeout(() => message.delete()
        .catch(error => console.log(` `)), 30000)});

};

client.on("ready", () => {
    setInterval(presidente, 30000);
});