const db = require("quick.db");

exports.run = async (client, message, args) => {

	var time1 = new db.table('time1');
	var time2 = new db.table('time2');
	var points = new db.table('points');
	var bet = new db.table('bet');

	const search = points.fetch(`points_${message.author.id}`);
	const st = bet.fetch('0');

	//Verificar se o time está no banco de dados;
	const time = args[0]
	const finish = time[0].toUpperCase() + time.substring(1);

	let times = "";
	try {
		times = [st.team1, st.team2];
	} catch (e) {
		return message.reply('Não tem nenhuma aposta aberta no momento.')
	}

   	if(!times.find(team => team === finish)) 
   		return message.reply(`**${finish}** não está participando desse **campeonato**. \nOs **times** que você pode apostar são: **${times.join(' ou ')}**`);

   	//Verificando se o usuário possui a quantidade de moeda;
	const estrelas = args[1];
	if(!estrelas)
		return message.reply('Você esqueceu de adicionar uma quantida de **Estrela(s) ⭐** na aposta.');

	if(estrelas < 1)
		return message.reply('Você precisa apostar uma quantidade maior que 1.')

	if(search <= 1)
		return message.reply(`Você não possui **Estrela(s) ⭐** suficiente para apostar.`);

	if(search < estrelas)
		return message.reply(`Você não possui **${estrelas} Estrela(s) ⭐** \nSeu saldo é **${search} Estrela(s) ⭐**`);

	if(isNaN(estrelas))
		return message.reply('Você precisa apostar uma quantidade em número.');
	
	//Verificar se o usuário já está em uma aposta;
	const t1f = time1.fetch(`t1_${message.author.id}`);
	const t2f = time2.fetch(`t2_${message.author.id}`);

	if(t1f) {
		return message.reply('Você já está participando de uma aposta.');
	} else if (t2f) {
		return message.reply('Você já está participando de uma aposta.');
	}

	//Team 1
	if(finish === st.team1) {
		message.reply(`Você está apostando **${estrelas} Estrela(s) ⭐** no time **${st.team1}** \nPara ver a tabela digite: **!tabela**`)
		.then(add => time1.add(`t1_${message.author.id}`, estrelas));

		points.subtract(`points_${message.author.id}`, estrelas);
	}

	//Team 2
	if(finish === st.team2) {
		message.reply(`Você está apostando **${estrelas} Estrela(s) ⭐** no time **${st.team2}** \nPara ver a tabela digite: **!tabela**`)
		.then(add => time2.add(`t2_${message.author.id}`, estrelas));

		points.subtract(`points_${message.author.id}`, estrelas);
	}

}