const { EmbedBuilder } = require('discord.js');
const client = require('../..');
const axios = require('axios');

//Bot da Twitch
client.on('ready', () => {

//Notificação da Twitch
  let shouldNotifyAboutGoingLive = true

    setInterval(async () => {
      const res = await axios.post(
        'https://gql.twitch.tv/gql',
        [
          {
            operationName: 'ChannelShell',
            variables: { login: 'anniesemtrema' },
            extensions: {
              persistedQuery: {
                version: 1,
                sha256Hash:
                  'a3688fc00f1c8600e2fc1a93e1d116a09243480c8c2df83e54ed0ca93c8145d1',
              },
            },
          },
        ],
        {
          headers: {
            accept: '*/*',
            'accept-language': 'en-GB',
            'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
            'client-session-id': '7eb298d7d88664df',
            'client-version': 'dca5635c-e0c5-46be-8e6f-e1bd524c98c1',
            'content-type': 'text/plain;charset=UTF-8',
            'sec-ch-ua':
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'x-device-id': 'CjAOj9ePFQgFSSeoUxczwF2bvpzBkgUN',
            Referer: 'https://www.twitch.tv/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        }
      )
      const twitch = Boolean(res.data[0].data.userOrError.stream)
      const canal = 'anniesemtrema'
      const uptime = await axios.get(`https://decapi.me/twitch/uptime/${canal}`).catch(err => console.log("erro"));
      const titulo = await axios.get(`https://decapi.me/twitch/status/${canal}`).catch(err => console.log("erro"));
      const avatar = await axios.get(`https://decapi.me/twitch/avatar/${canal}`).catch(err => console.log("erro"));
      const jogo = await axios.get(`https://decapi.me/twitch/game/${canal}`).catch(err => console.log("erro"));
      let viewers = "";

      try {
        viewers = await axios.get(`https://decapi.me/twitch/viewercount/${canal}`)
        viewers = viewers.data === `${canal} is offline` ? 0 : viewers.data
      } catch (e) {
        console.log({})
      }

      if (twitch) {
        if (shouldNotifyAboutGoingLive) {

            //Embed
            const embed = new EmbedBuilder()
            .setTitle('Rainha do sexo está online! - Twitch')
            .setDescription(`**[nica](https://www.twitch.tv/${canal})** acabou de abrir a live na **twitch** \n**[CLIQUE AQUI!](https://www.twitch.tv/${canal})** para ir até a **live**. \n\n**TÍTULO DA LIVE**\`\`\`${titulo.data}\`\`\``)
            .addFields({ name: '** **', value: '** **', inline: false })
            .addFields({ name: 'STATUS', value: 'ㅤ🟢', inline: true })
            .addFields({ name: 'ㅤㅤJOGO', value: `**[${jogo.data}](https://www.twitch.tv/directory/game/${jogo.data.replace(/\s/g, '%20')})**`, inline: true })
            .addFields({ name: 'VIEWERS', value: `⠀⠀**\`${viewers}\`**`, inline: true }) 
            .setImage(avatar.data)
            .setColor("#FFFFFF")

          client.channels.cache
            .get('737035995400241168')
            .send({ content: '|| <@&992148249760763924> <@207707074132443137> ||', embeds: [embed] })
          shouldNotifyAboutGoingLive = false
        }
      } else {
        shouldNotifyAboutGoingLive = true
      }
    }, 60000)
});