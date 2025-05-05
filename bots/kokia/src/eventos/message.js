const { nina } = require('../../src/util/config');

module.exports = async (channel, userstate, message, self, viewers) => {

  if (message.username === channel.username) return;

  if (self.startsWith("!")) {
    self = self.slice(1).trim();

    let command = self.split(' ')[0];
    let cmd = channel.commands.get(command);
    if (cmd) return cmd.run(channel, userstate, message, self);
  }

  function channelPoints() {

    const user = message["username"];
    const mensagem = self;

      //Timeout em MOD;
    if(message["custom-reward-id"] === "43d49a67-ba35-4229-bdbb-4b79e7c8f028") {
      channel.say(nina.owner, `Timeout foi aplicado com sucesso no Moderador.`);
    }

    //Vip;
    if(message["custom-reward-id"] === "00720e74-7310-40a6-b706-70fc6d0817e3") {
      channel.say(nina.owner, `${user}, seu VIP foi aplicado com sucesso. o/`);
    }
      
    //Chaves
    if(message["custom-reward-id"] === "fbf1422a-2ecd-4737-bb9f-6c8909571c15") {
      channel.say(nina.owner, `Sua chave foi comprada com sucesso! Entre no !discord da nica e digite: /espolio para abrir o seu baú.`);
    }

    //Dados
    if(message["custom-reward-id"] === "c883623c-b337-469a-9bba-ede7e652032a") {
      
      const dado = Math.floor(Math.random() * (20 - 1 + 1)) + 1;

      if(`${dado}` === mensagem) {
        channel.say(nina.owner, `${user} escolheu o número ${mensagem}. O número que caiu foi ${dado} || ${user} ganhou 300 NP Event. @anniesemtrema`);
      } else {
        channel.say(nina.owner, `${user} perdeu. || O número que caiu foi ${dado}`);
      }
    }

    //Timeout
    if(message["custom-reward-id"] === "74605290-2934-40e3-b7cd-8018f8c9b070") {
       channel.say(nina.owner, `Timeout foi aplicado com sucesso.`);
      channel.say(nina.owner, `/timeout ${mensagem} 120 Pontos do canal. || 2 minutos de timeout aplicado por: ${user}`);
    }
   
  }
    
channelPoints()
};