const { EmbedBuilder } = require('discord.js');
const db = require("quick.db");

exports.run = async (client, message, args) => {

	var time1 = new db.table('time1');
	var time2 = new db.table('time2');
	var bet = new db.table('bet');
	const st = bet.fetch('0');

	const t1 = time1.all().filter(data => data.ID);
	const t2 = time2.all().filter(data => data.ID);

	let coins1 = "";
	let coins2 = "";

    for(let i=0; i < t1.length; ++i) {
    	coins1 = t1[i].data + t1[i].data;
    }

    for(let i=0; i < t2.length; ++i) {
    	coins2 = t2[i].data + t2[i].data;
    }

   	const total = coins1 + coins2 || "0";
   	
   	try {
   		const team1 = st.team1;
		const team2 = st.team2;

		const embed = new EmbedBuilder()
		.setTitle(`${st.team1} vs ${st.team2}`)
		.setDescription(`💰 Total de Estrelas apostado: **${total}** \n\n**${t1.length}** pessoas apostando no time **${team1}**. \n**${t2.length}** pessoas apostando no time **${team2}**.`)
		.setColor('#FFFFFF')

		message.reply({ embeds: [embed] })

	} catch (e) {
		message.reply('Não tem nenhuma aposta aberta no momento.');
	}
}