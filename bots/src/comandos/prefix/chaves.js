const db = require("quick.db")

exports.run = async (client, message, args) => {

    if (message.author.id === '226393792335314945') { 

	//Aviso
	if(!args.length)
    return message.reply(`Você esqueceu de mencionar se quer **adicionar ou remover** as <:key:927744143214649404> de algum usuário.`)

	//Args
    let option = args.splice(0, 1)[0].toLowerCase();

    if(option === 'add') {
    	if(args.length) {
    		let membro = message.mentions.members.first() || message.member;
			let quantidade = args[1]
			let chaves = db.add(`chaves_${membro.id}`, quantidade)
			let total = db.fetch(`chaves_${membro.id}`)
			message.reply(`Foi adicionado **${quantidade} <:key:927744143214649404>** para o usuário <@${membro.id}> \n<@${membro.id}> agora possui **${total} <:key:927744143214649404>**`)
		}
	}

	if(option === 'remove') {
		if(args.length) {

    		let membro = message.mentions.members.first() || message.member;
			let total = db.get(`chaves_${membro.id}`)
			if (total === null) {
				let total = '0';
			}
			chaves = db.delete(`chaves_${membro.id}`)
			message.reply(`Foi removido todas as <:key:927744143214649404> do usuário <@${membro.id}> \n<@${membro.id}> possuia **${total} <:key:927744143214649404>**`)
		}
	}

	if(option === 'info') {
		if(args.length) {
			const target = message.mentions.members.first() || message.member;
			let chaves = db.get(`chaves_${target.id}`)
			message.reply(`${target} possui **${chaves}** <:key:927744143214649404>`)
		}
	}
	
} else {
    message.reply('Apenas a **nica** possui permissão para executar esse comando.')
    }     
}
