const message = require('../../src/eventos/message');
const Squad = require('../../src/services/Squad');

module.exports.run = async (channel, user, message, self) => {
  const squad = new Squad().getSquad();
  return channel.say(user, `Squad da última partida: ${await squad}`);
}