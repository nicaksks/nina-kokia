const message = require('../../src/eventos/message');
const sorteio = require('../../src/schemas/sorteio.js');
const { nina } = require('../../src/util/config.json');

module.exports.run = async (channel, user, message, self, userstate) => {

  const args = self.split(' ');
  const command = args.shift();
  const options = args.shift();

  const participantes = await sorteio.distinct('name');
  const mod = message['user-type'] === 'mod' || message.username === nina.owner;

  const index = new Set();
  function random(max, min = 0) {
    const number = Math.floor(Math.random() * participantes.length);
    if (index.has(number)) {
      return this.getUniqueRandomNumber(max, min);
    } else { 
        index.add(number);
        return number;
    }
  }

  //Iniciar o sorteio.
  if(mod) {
    if(options === "start") {
      if(participantes.length <= 0) return channel.say(user, "Você não pode iniciar o sorteio, pós não tem nenhum membro participando.");
      const ganhador = `${participantes[random()]} ganhou o sorteio. o/`;
      return channel.say(user, ganhador);
    }
  };

  //Mostrar a lista de participante.
  if(mod) {
    if(options === "list") {
      if(participantes.length <= 0)
        return channel.say(user, 'Atualmente não tem ninguém participando do sorteio.');
      if(participantes)
          return channel.say(user, `${participantes.length} membro(s) estão participantando do sorteio.`);
    }
  };

  //Resetar o banco de dados.
  if(mod) {
    if(options === "delete") {
      if(participantes.length <= 0)
        return channel.say(user, 'O Banco de dados já foi resetado.');

      await sorteio.deleteMany()
      channel.say(user, 'Banco de dados resetado. || Para participar do novo sorteio digite: !participar');
    }
  };
};