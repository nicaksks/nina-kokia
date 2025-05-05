const { nina } = require('../../src/util/config');

module.exports = async (channel, userstate, message, self) => {

  function channelPoints() {

    const user = message["username"];
    const mensagem = self;

    //Timeout em MOD;
    if(message["custom-reward-id"] === "43d49a67-ba35-4229-bdbb-4b79e7c8f028") {
      channel.say(nina.owner, `/timeout ${mensagem} 120 Pontos do canal. || 2 minutos de timeout aplicado por: ${user}`);
    }

    //Vip;
    if(message["custom-reward-id"] === "00720e74-7310-40a6-b706-70fc6d0817e3") {
      channel.say(nina.owner, `/vip ${user}`);
    }

  }

channelPoints()
};