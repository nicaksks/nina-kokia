const db = require("quick.db");

exports.run = async (client, message, args) => {

	if(message.author.id === "226393792335314945") {

    	//Banco de dados;
    	var banAPI = new db.table('banAPI');

    	const user = await message.mentions.users.first().id;

    	const search = banAPI.fetch(`banAPI_${user}`);
    	if(search === null) return message.reply(`<@${user}> já está desbanido(a)`);

    	banAPI.delete(`banAPI_${user}`);
    	message.reply(`<@${user}> foi desbanido(a).`);
    } else {
    	message.reply('Você não tem permissão para desbanir os usuários **Discord** da **nina**.');
    }
}