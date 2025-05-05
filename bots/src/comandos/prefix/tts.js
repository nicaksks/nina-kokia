const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, voiceDiscord, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { getAudioUrl } = require('google-tts-api');

exports.run = async (client, message, args) => {

        //Casso o usuário não esteja no canal de voz.
        if(!message.member.voice.channel)
            return message.reply(`**${message.author.username}**, entre em um **canal de voz**. \nDepois que você entrar em um **canal de voz**, digite o comando novamente.`)
            
        //Caso a usuário esqueça de digitar uma palavra.
        if(!args.length)
            return message.reply(`**${message.author.username}**, você esqueceu digitar o que você queria falar.`);

        //Mensagem do usuário.
        const mensagem = `${message.author.username} disse`+ args.join(' ')
        const mensagem1 = `${message.author.username} said`+ args.join(' ')
        if(mensagem.length > 200) 
            return message.reply(`**${message.author.username}**, a **nina** não consegue falar mais de **200** letras.`);

        //Sistema para conectar no voice.
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.channel.guild.id,
            adapterCreator: message.channel.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false,
            volume: 200
        });

        //TTS - Português
        const tts_ptbr = await getAudioUrl(mensagem, {
            lang: 'pt-br',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000
            //splitPunct: ',.?!'
        })

        //TTS - Inglês
        const tts_enus = await getAudioUrl(mensagem1, {
            lang: 'en',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000
            //splitPunct: ',.?!'
        })

        //Filtro
        const filter = i => ['pt-br', 'en-us'].includes(i.customId) && i.user.id === message.author.id;;
        const collector = message.channel.createMessageComponentCollector({ filter: filter, time: 3600000 });

        //Collector - Início
        collector.on('collect', async i => {
            if(i.customId === 'pt-br') {
                const player_ptbr = createAudioPlayer();
                const resource_ptbr = createAudioResource(tts_ptbr);
                player_ptbr.play(resource_ptbr);
                connection.subscribe(player_ptbr);

                console.log(`${message.author.username} enviou um TTS em Português no servidor ${message.guild.name} (${message.guild.id}).`)

                player_ptbr.on(AudioPlayerStatus.Idle, () => {
                    connection.destroy();
                });
            }
            if(i.customId === 'en-us') {
                const player_enus = createAudioPlayer();
                const resource_enus = createAudioResource(tts_enus);
                player_enus.play(resource_enus);
                connection.subscribe(player_enus);

                console.log(`${message.author.username} enviou um TTS em Inglês no servidor ${message.guild.name} (${message.guild.id}).`)

                player_enus.on(AudioPlayerStatus.Idle, () => {
                    connection.destroy();
                });
            }
        })

        //Collecotr - Fim
        collector.on('end', collected => console.log(`O TTs foi usado ${collected.size} veze(s).`));

        //Embed
        const embed = new EmbedBuilder()
        .setTitle(`nina está aqui para ajudar ${message.author.username}`)
        .setDescription(`**${message.author.username}** disse: \`\`\`${args.join(' ')}\`\`\``)
        .setColor("#FFFFFF")

        //Botões
        const idiomas = new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
        .setCustomId('pt-br')
        .setLabel('Português')
        .setEmoji('🇧🇷')
        .setStyle(ButtonStyle.Success))
        .addComponents(new ButtonBuilder()
        .setCustomId('en-us')
        .setLabel('Inglês')
        .setEmoji('🇺🇸')
        .setStyle(ButtonStyle.Danger));

        return message.reply({ embeds: [embed], components: [idiomas] })
}
