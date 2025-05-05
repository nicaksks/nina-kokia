const client = require('../..');
const { ActivityType } = require('discord.js');

client.on('ready', () => {
    client.user.setActivity({ name: "League of Legends", type: ActivityType.Playing });
});