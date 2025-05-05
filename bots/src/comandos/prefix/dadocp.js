const db = require("quick.db")

exports.run = async (client, message, args) => {

	//Apenas essa pessoa tem permissão para usar esse comando.
	if (message.author.id === '811913211737014322') {

		//Aviso
		if (!args.length)
			return message.reply(`Você esqueceu de adicionar o **NP Event**`)

		//Args
		let option = args.splice(0, 1)[0].toLowerCase();

		//Subcomando
		if (option === 'add') {
			if (args.length) {
				var npEvent = new db.table('amount');
				let codigo = args[0]
				npEvent.set(`dadonp`, codigo)
				message.channel.send(`**${codigo} códigos** de **NP Event** foi adicionado ao Evento **Dado**.`)
			}
		}


		if (option === 'remove') {
			var npEvent = new db.table('amount');
			message.channel.send(`O Código de **NP Event** foi removido com sucesso.`)
			npEvent.set(`dadonp`, 0)
		} else {
			message.reply('Apenas a **nica** possui permissão para executar esse comando.')
		}
	}
}
