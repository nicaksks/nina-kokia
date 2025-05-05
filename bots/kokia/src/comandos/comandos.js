const message = require('../../src/eventos/message');
const customCommands = require('../../src/schemas/commands.js');

module.exports.run = async (channel, user, message, self) => {

  const all = await customCommands.distinct('name')
  if(all.length === 0) return channel.say(user, 'Atualmente não tem nenhum comando cadastrado no banco de dados.');

  for(i in all) {
    var commands = all.join(", ");
    return channel.say(user, `!participar, !squad, ${commands}`);
  };
};