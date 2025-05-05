const client = require('../..');
const { EmbedBuilder } = require('discord.js');

client.on("guildMemberUpdate", (oldMod, newMod) => {

    //Canal que a mensagem será enviada caso a DM esteja bloqueada;
    const canal = client.channels.cache.get("922555874537525258");

    //Embed;
    const embed = new EmbedBuilder()
    .setTitle(`${newMod.user.username} seja bem-vindo(a) a **moderação da nica**`)
    .setDescription(`
        Obrigada por está ajudando a comunidade da **nica** tanto no **Discord** quanto na **Twitch**.

        Quero me apresentar! Meu nome é **nina** e junto com a **Kokia** faço parte da **moderação** da **nica**.

        Caso você queira ler minha documentação **[CLIQUE AQUI!](https://ninabot.netlify.app)**
        Caso queira ler a documentação da minha irmã **Kokia** **[CLIQUE AQUI!](https://ninabot.netlify.app/kokia)**

        Caso você tenha alguma dúvida ou sugestão de funções para mim(**nina**) ou para **Kokia**, envie uma mensagem no canal <#922555874537525258>`)
    .setColor('#FFFFFF')

    //Verificar a se a pessoa possui o cargo de moderador;
    if (!oldMod.roles.cache.has("737035995031011447") && newMod.roles.cache.has("737035995031011447"))
        newMod.user.send({ embeds: [embed] }).catch(e => canal.send({ content: `||<@${newMod.user.id}>|| \nSua **DM** está bloqueada, então estou enviando a mensagem aqui no chat da **moderação**.`, embeds: [embed] }));
});
