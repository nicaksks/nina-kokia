const client = require('../..');
const { ChannelType } = require('discord.js');

client.on("voiceStateUpdate", async (oldChannel, newChannel) => {

    const guild = client.guilds.cache.get("737035994494140517");
    const createChannel = guild.channels.cache.get('976984360207122463');
    const user = await client.users.fetch(newChannel.id);
    const member = await guild.members.fetch(user.id).catch(error => {});

    if(oldChannel.channel || newChannel.channel || !oldChannel.channel || !newChannel.channel)
        if(!oldChannel.channel && newChannel.channel || newChannel.channel && oldChannel.channel)
            if(newChannel.channel.id === createChannel.id) {
                const channel = await newChannel.guild.channels.create({
                    name: `⸜ Cobalt ⸝`, 
                    type: ChannelType.GuildVoice,
                    userLimit: '4',
                    parent: newChannel.channel.parent
                }).catch(error => {}).then(channel => {
                    newChannel.setChannel(channel.id).catch(error => {});
                })
            }

    if(!newChannel.channel || newChannel.channel && oldChannel.channel) {
        if(oldChannel.channel.name === `⸜ Cobalt ⸝`) {
            if(oldChannel.channel.members.size === 0) {
                oldChannel.channel.delete().catch(error => {});
            }
        }
    }
})