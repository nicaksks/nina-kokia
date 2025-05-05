const db = require("quick.db")

exports.run = async (client, message, args) => {

	//Apenas essa pessoa tem permissão para usar esse comando.
    if (message.author.id === '226393792335314945') { 

	//Apagar a mensagem enviada;
    message.delete().catch(O_o => {});

	//Aviso
	if(!args.length)
    return message.reply(`Você esqueceu de adicionar o **NP Event**`)

	//Args
    let option = args.splice(0, 1)[0].toLowerCase();

    //Subcomando
    if(option === 'add') {
    	if(args.length) {
    		var npEvent = new db.table('npEvent');
			let codigo = args[0]
			npEvent.add(`np_${codigo}`, 1)
			message.channel.send(`O Código de **NP Event** foi adicionado ao Evento **Quiz**.`)
		}
	}
    if(option === 'remove') {
    	if(args.length) {
    		var npEvent = new db.table('npEvent');
			let codigo = args[0]
			message.channel.send(`O Código de **NP Event** foi removido com sucesso.`)
			npEvent.delete(`np_${codigo}`)
		}
	}	
} else {
    message.reply('Apenas a **nica** possui permissão para executar esse comando.')
    }     
}
