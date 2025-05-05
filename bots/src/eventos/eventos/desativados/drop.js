const { EmbedBuilder } = require('discord.js');
const client = require('../..');
const db = require('quick.db');
const axios = require('axios');

client.on('ready', () => {

  var emotes = new db.table('streamersEmotes');
  emotes.set('1', { name: 'OneCircle', url: 'https://www.twitch.tv/sadsadad', emote: 'https://i.imgur.com/2u5szKC.png', icon: 'https://i.imgur.com/87JRBZX.png', twitchUser: 'sadsadad' });
  emotes.set('2', { name: 'Fang', url: 'https://www.twitch.tv/rainoyt', emote: 'https://i.imgur.com/fqKcxWG.png', icon: 'https://i.imgur.com/HhqomQk.png', twitchUser: 'rainoyt' });
  emotes.set('3', { name: 'Danana', url: 'https://www.twitch.tv/ha0012', emote: 'https://i.imgur.com/5QDFXwi.png', icon: 'https://i.imgur.com/fZaNEv4.png', twitchUser: 'ha0012' });
  emotes.set('4', { name: 'gwork', url: 'https://www.twitch.tv/gwork1', emote: 'https://i.imgur.com/Jrnmj8i.png', icon: 'https://i.imgur.com/wUmVitf.png', twitchUser: 'gwork1' });

  const all = emotes.all().filter(data => data.ID);

  for (let i = 1; i <= all.length; ++i) {

    let shouldNotifyAboutGoingLive = true

    setInterval(async () => {

      todos = emotes.get(`${i}`)

      name = todos.name
      url = todos.url
      emote = todos.emote
      twitchUser = todos.twitchUser

      const res = await axios.post(
        'https://gql.twitch.tv/gql',
        [
          {
            operationName: 'ChannelShell',
            variables: { login: twitchUser },
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

      todos = emotes.get(`${i}`)

      name = todos.name
      url = todos.url
      emote = todos.emote
      twitchUser = todos.twitchUser
      icon = todos.icon


      const twitch = Boolean(res.data[0].data.userOrError.stream)

      if (twitch) {
        if (shouldNotifyAboutGoingLive) {

          //Embed
          const embed = new EmbedBuilder()
            .setTitle(`${name} está online!`)
            .setDescription(`**[${name}](${url})** entrou ao vivo! \n**[CLIQUE AQUI](${url})** para ir ate a **live**. \n\n**EMOTE/ÍCONE** que vai está dropando na live **${name}**.`)
            .setImage(emote)
            .setImage(icon)
            .setColor("#FFFFFF")

          let embed1 = new EmbedBuilder()
            .setTitle(`${name} está online!`)
            .setDescription(`**[${name}](${url})** entrou ao vivo! \n**[CLIQUE AQUI](${url})** para ir ate a **live**. \n\n**EMOTE/ÍCONE** que vai está dropando na live **${name}**.`)
            .addFields({ name: 'EMOTE', value: '** **', inline: true })
            .addFields({ name: 'ÍCONE', value: '** **', inline: true })
            .setURL('https://playeternalreturn.com')
            .setImage(emote)
            .setColor("#FFFFFF")

          let embed2 = new EmbedBuilder()
            .setTitle(`${name} está online!`)
            .setURL('https://playeternalreturn.com')
            .setImage(icon)
            .setColor("#FFFFFF")

          client.channels.cache
            .get('737035995400241168')
            .send({ content: '|| <@&999636393355657267> ||', embeds: [embed1, embed2] })
          shouldNotifyAboutGoingLive = false
        }
      } else {
        shouldNotifyAboutGoingLive = true
      }
    }, 60000)
  }
});