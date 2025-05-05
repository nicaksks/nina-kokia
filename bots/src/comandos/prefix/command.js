const db = require("quick.db");
const config = require('../../../src/util/config.json');
const boostRole = config['sub'][0].role;

exports.run = async (client, message, args) => {

	//Aviso;
	if(!args.length)
		return message.reply(`Você esqueceu de adicionar o **nome** do comando e o **texto**. \nPara criar um comando custa: **20** Estrelas ⭐`)

	//Args;
	let option = args.splice(0, 1)[0].toLowerCase()

    //Banco de dados;
    var cc = new db.table('customCommands');
    var points = new db.table('points');
    var ccQ = new db.table('customCommandsQtd');

    //Verificar se o usuário possui Estrelas;
    const estrelas = points.fetch(`points_${message.author.id}`);
    const searchQtd = ccQ.fetch(`ccq_${message.author.id}`);

    //Adicionar um comando novo;
    if(option === 'add') {
    	if(args.length) {

    		//Verificar role;
    		const boostCheck = message.member.roles.cache.has(boostRole);

    		//Verificar se o membro é boostado ou não;
    		if(boostCheck) {
    			if(searchQtd >= 2)
    				return message.reply('Você já possui 2 comandos criado. \nCaso queira adicionar outro comando, delete o seu comando atual.');
    		} else {
    			if(searchQtd >= 1)
    				return message.reply('Você já possui um comando criado. \nCaso queira adicionar outro comando, delete o seu comando atual.');
    		}

    		if(estrelas >= 20) {

    			//Nome do comando;
    			let commandName = args[0].toLowerCase();
    			if(commandName.length < 3) return message.reply('O nome do comando precisa ter mais que **3** digitos.');
    			if(commandName.length > 10) return message.reply('O nome do comando só pode ter até 10 digitos.');
    			if(commandName === 'comandos') return message.reply('Você não pode criar um comando chamado comandos');
    			if(commandName === 'commands') return message.reply('Você não pode criar um comando chamado commands');

    			//Verificar se o comando existe;
    			const check = cc.fetch(commandName);

    			//Verificar se o comando já é de alguém;
    			try {
    				if(check.author > 1)
    					return message.channel.send(`Esse comando já existe no **banco de dados**. \n\nEsse comando foi criado por **${check.authorTag}**. \nComando criado <t:${check.timestamp}:F>`);

    			} catch (e) {

    				let commandDescription = args.slice(1).join(' ');
    				if(commandDescription.length < 3) return message.reply('A descrição do comando precisa ter mais que **3** digitos.');
    				if(commandDescription.length > 300) return message.reply('A descrição do comando só pode ter até 300 digitos.');

    				//Timestamp
    				var data = new Date();
    				data = new Date(data.getTime());
    				const timestamp = Math.floor(data.getTime() / 1000);

    				message.reply(`Comando criado com sucesso! \nFoi descontado **20** Estrelas ⭐ das suas economias. \n\n**INFORMAÇÕES DA CRIAÇÃO DO COMANDO** \n**Nome do comando**: \`${commandName}\` \n**Descrição do comando**: \`${commandDescription}\``);

    				cc.set(commandName, { name: commandName, description: commandDescription, author: message.author.id, authorTag: message.author.username, timestamp: timestamp });
    				points.subtract(`points_${message.author.id}`, 20)
    				ccQ.add(`ccq_${message.author.id}`, 1)
    			} 
    		} else {
    			message.reply(`Você não pode criar um **comando custom**. \n\n**MOTIVO**: Você não possui **20** Estrelas ⭐ \n> Atualmente possui **${estrelas}** Estrelas ⭐.`)
    		}
    	}
    } 

	//Editar um comando que já existe;
	if(option === 'edit') {
		if(args.length) {

    		//Nome do comando;
    		let commandName = args[0].toLowerCase();
    		if(commandName.length < 3) return message.reply('O nome do comando precisa ter mais que **3** digitos.');
    		if(commandName.length > 10) return message.reply('O nome do comando só pode ter até 10 digitos.');

			//Verificar se o comando existe;
			const check = cc.fetch(commandName);

			try {
				if(check.author === message.author.id) {

					let commandDescription = args.slice(1).join(' ');
					if(commandDescription.length < 3) return message.reply('A descrição do comando precisa ter mais que **3** digitos.');
					if(commandDescription.length > 300) return message.reply('A descrição do comando só pode ter até 300 digitos.');

						//Timestamp
						var data = new Date();
						data = new Date(data.getTime());
						const timestamp = Math.floor(data.getTime() / 1000);

						message.reply(`Comando editado com sucesso! \n\n**INFORMAÇÕES DA ALTERAÇÃO DO COMANDO** \n**Descrição do comando**: \`${commandDescription}\``);

						cc.set(commandName, { name: check.name, description: commandDescription, author: message.author.id, authorTag: message.author.username, timestamp: timestamp });
					}  else {
						message.reply('Você não pode editar esse comando, pq ele não é seu.');
					}
				} catch (e) {
					message.reply('Não é possível editar esse comando. \n**MOTIVO**: Esse comando não existe no banco de dados.');
				}
			}
		}

	//Deletar um comando que já existe;
	if(option === 'delete') {
		if(args.length) {

    		//Nome do comando;
    		let commandName = args[0].toLowerCase();

			//Verificar se o comando existe;
			const check = cc.fetch(commandName);

			try {
				if(check.author === message.author.id) {

					message.reply(`Comando deletado com sucesso!`);
					cc.delete(`${commandName}`)
					ccQ.subtract(`ccq_${message.author.id}`, 1)

				}  else {
					message.reply('Você não pode deletar esse comando, pq ele não é seu.');
				}
			} catch (e) {
			 message.reply('Não é possível deletar esse comando. \n**MOTIVO**: Esse comando não existe no banco de dados.');
			}
		}
	}
}