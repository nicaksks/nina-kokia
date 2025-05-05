const db = require("quick.db");

exports.run = async (client, message, args) => {

	if(message.author.id === "226393792335314945") {

    	//Banco de dados;
    	var banAPI = new db.table('banAPI');

    	const user = await message.mentions.users.first().id;
    	const motivo = args.slice(1).join(' ') || "Abusando de falhas no sistema da nina.";
        const duration = "Permanente";

    	const search = banAPI.fetch(`banAPI_${user}`);
    	const bannedBy = banAPI.all().filter(data => data.ID);
    	if(search) return message.reply(`<@${user}> já está banido(a) \nBanido por: <@${search.por}>`);
        if(user === "226393792335314945") return message.reply('Você não pode banir a minha criadora.');

    	banAPI.set(`banAPI_${user}`, { motivo: motivo, por: message.author.id, duration: duration });
    	message.reply(`<@${user}> foi banido(a). \n**Motivo**: ${motivo}`);
    } else {
    	message.reply('Você não tem permissão para banir os usuários de usa os comandos da **nina**.');
    }
}