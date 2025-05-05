exports.run = async (client, message, args) => {

    if(message.author.id === "226393792335314945") {

        const servidor = args[0];
        const name = client.guilds.cache.get(servidor).name

        try {
            client.guilds.cache.get(servidor).leave()
            message.channel.send(`**nina** foi removida do servidor **${name} (${servidor})** com sucesso.`);
        } catch (e) {
            message.reply('**nina** não faz parte desse servidor.');
        }
    } else {
        message.reply('Você não permissão para usar esse comando.')
    }
}
