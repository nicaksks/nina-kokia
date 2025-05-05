const { EmbedBuilder } = require('discord.js');
const client = require('../..');

client.on('messageReactionAdd', async (reaction, user, message) => {
    if(reaction.message.channel.type === "dm") return;
    if(reaction.message.partial) await reaction.message.fetch(true);
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.author.bot || user.bot) return;

    let canal = await client.channels.cache.get('968520033808556062')

    try {
        let muralFetch = await canal.fetch({limit: 100})
    } catch (e) {
        console.log(' ')
    }

    if(reaction.message.guild.id === "737035994494140517") {
        if(reaction.emoji.id === "949311372381024286") {
            let imagem = reaction.message.attachments.first()
            let emoji = reaction.count
            if (emoji == 3){

                const embed = new EmbedBuilder()
                //.setAuthor(reaction.message.author)
                .setAuthor({ name: `Mural da vergonha. - ${reaction.message.author.username}`, iconURL: reaction.message.author.avatarURL() })
                .setDescription(`
                Você viu um membro do servidor fazendo algo vergonhoso?
                Reaja a mensagem dele(a) com o emoji <:peepoChomky:949311372381024286>

                Caso queira visualizar a mensagem original **[clique aqui!](https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})**`)
                .setColor('#FFFFFF')
                if (reaction.message.content.length >= 3) embed.addFields({ name: "MENSANGEM", value: `\`\`\`${reaction.message.content}\`\`\``, inline: false })
                try {
                    if(reaction.message.attachments.size >= 3) {
                        embed.setImage(reaction.message.attachments.first().url)
                    } else {
                        embed.setImage(reaction.message.embeds[0].data.url);
                    }
                } catch(e) { 
                }
                canal.send({ embeds: [embed] })

            }
        }
    }
})