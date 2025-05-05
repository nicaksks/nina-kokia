const db = require("quick.db");

exports.run = async (client, message, args) => {

	//Banco de dados;
	var bet = new db.table('bet');
	var time1 = new db.table('time1');
	var time2 = new db.table('time2');
	var points = new db.table('points');

	const t1 = time1.all().filter(data => data.ID);
	const t2 = time2.all().filter(data => data.ID);

	const canal = client.channels.cache.get(`994788562862080141`);

	//Apenas essa pessoa tem permissão para usar esse comando.
    if (message.author.id === '226393792335314945') { 

    	//Aviso;
    	if(!args.length)
    		return message.reply(`Para criar uma **aposta** é necessário usar o seguinte comando: !bet criar <time-1> <time-2>`);

    	//Args;
    	let option = args.splice(0, 1)[0].toLowerCase()

    	if(option === 'criar') {

    		const n1 = args[0];
    		const time1 = n1[0].toUpperCase() + n1.substring(1);
    		const n2 = args[1]; 
    		const time2 = n2[0].toUpperCase() + n2.substring(1);

    		bet.set("0", { team1: time1, team2: time2 });
    		message.channel.send(`**Aposta** criada com sucesso! \n**${time1}** vs **${time2}**`)
    		.then(channel => canal.send(`**Uma aposta foi aberta!**  \n!apostar ${time1} <quantidade-de-estrelas>  \n!apostar ${time2} <quantidade-de-estrelas> `))
    	}

    	if(option === 'finalizar') {

    		const n = args[0];
    		const resultado = n[0].toUpperCase() + n.substring(1);
    		const st = bet.fetch('0');

    		//Time 1;
    		if(resultado === st.team1) {

    			//Time 1;
    			for(let i=0; i < t1.length; ++i) {

    				var apostadores = t1[i].ID.replace('t1_' , '');
        			var coins = t1[i].data;

    				points.add(`points_${apostadores}`, 2 * coins);
    				time1.delete(`t1_${apostadores}`);
    			}

    			//Time 2;
    			for(let i=0; i < t2.length; ++i) {

    				var apostadores = t2[i].ID;
    				time2.delete(apostadores);
    			}

    			canal.send(`**${st.team1} VENCEU A PARTIDA!** \nA premiação está sendo distribuiada para **${t1.length} participante(s).**`);
    			bet.delete('0');
    		}

    		//Time 2;
    		if(resultado === st.team2) {

    			//Time 2;
    			for(let i=0; i < t2.length; ++i) {

    				var apostadores = t2[i].ID.replace('t2_' , '');
        			var coins = t2[i].data;

    				points.add(`points_${apostadores}`, 2 * coins);
    				time2.delete(`t2_${apostadores}`);
    			}

    			//Time 1;
    			for(let i=0; i < t1.length; ++i) {

    				var apostadores = t1[i].ID;
    				time1.delete(apostadores);
    			}

    			canal.send(`**${st.team2} VENCEU A PARTIDA!** \nA premiação está sendo distribuiada para **${t2.length} participante(s).**`);
    			bet.delete('0');
    		}

    	}
    } else { 
    	message.reply('Apenas a **nica** possui permissão para executar esse comando.');
    }     
}
