const client = require('../..');
const axios = require('axios');

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (message.guild.id === "737035994494140517") {

        if (message.author.bot) return;

        function mobile() {
            const u = /^\s*https:\/\/([^\s]+\.)?vm.tiktok.com\/([^\s?]+)(\?[^\s]*)?\s*$/;
            const m = u.exec(message.content);

            const filter = (reaction, user) => {
                return reaction.emoji.name === '🩹' && user.id === message.author.id;
            };
            const collector = message.createReactionCollector({ filter, time: 60000 });

            if (m) {

                message.react('🩹').then(reaction => setTimeout(() => {
                    reaction.remove().catch(err => console.log('[Tiktok Fix] - Ocorreu um erro ao remover a reação.'))
                }, 60000));

                collector.on('collect', (reaction, user) => {
                    if (m) {
                        message.delete();
                        message.channel.send(`
                        Enviado por **${message.author.username}** \nhttps://vm.vxtiktok.com/${m[2]}`).catch(err => console.log('[Twitter Fix] - Ocorreu um erro ao alterar a URL do Twitter.'));
                        collector.stop()
                    }
                })
            };
        }

        function web() {
  const url = /^\s*https:\/\/([^\s]+\.)?twitter.com\/([^\s?]+)(\?[^\s]*)?\s*$/;
  const match = url.exec(message.content);

  if (match) {
    message.delete();
    message.channel.send(`
          enviado por **${message.author.username}** \nhttps://www.vxtwitter.com/${match[2]}`).catch(err => console.log('[Twitter Fix] - Ocorreu um erro ao alterar a URL do Twitter.'))
  }
        }

        function instagram() {
            const url = /^https:\/\/(?:www\.)?instagram.com\/([^\s?]+)(\?[^\s]*)?\s*$/;
            const match = url.exec(message.content);

            const filter = (reaction, user) => {
                return reaction.emoji.name === "🩹" && user.id !== client.user.id;
            };

            const collector = message.createReactionCollector({ filter, max: 1 });

            if (match) {
                message.react("🩹")
                    .then(reaction => setTimeout(() => {
                        reaction.remove()
                            .catch((e) => {
                                //console.log(`[ERRO] - ${message.guild.name} (${message.guild.id}) ocorreu um erro ao deletar o emoji da url do tiktok browser.`);
                            });
                    }, 60000));
            }

            collector.on("collect", () => {
                if (match) {
                    message.delete()
                        .then(() => {
                            return message.channel.send(`Enviado por **${message.author.username}** \nhttps://ddinstagram.com/${match[1]}`)
                                .catch((e) => {
                                    console.log(`[ERRO] - ${message.guild.name} (${message.guild.id}) ocorreu um erro ao alterar a URL.`);
                                });
                        });
                };
            });
        };

        instagram();
        mobile();
        web();
    };
});