const client = require('../..');

client.on('messageCreate', async (message) => {
  if (message.channel.id === '973617232015929424') {
      await message.react('❤️');
    }
});