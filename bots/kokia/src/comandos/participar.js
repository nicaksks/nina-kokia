const message = require('../../src/eventos/message');
const dbConnect = require('../../src/sql/dbConnect.js');
const sorteio = require('../../src/schemas/sorteio.js');

module.exports.run = async (channel, user, message, self) => {

  const check = await sorteio.findOne({ name: message.username })
  if(check) return channel.say(user, `${message.username} você já está participando do sorteio.`);

  //Banco de dados;
  const participar = new sorteio({
    name: message.username
  })
  participar.save()
  if(!check) return channel.say(user, `${message.username} agora você está participando do sorteio.`)
}