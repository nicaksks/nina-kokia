const axios = require('axios');

module.exports = class Duo {

  #_instance;

  constructor() {
    this.#_instance = axios.create({
      baseURL: 'https://open-api.bser.io',
      headers: {
        'x-api-key': ""
      }
    })
  }

  async lastGame() {
    try {
      const { data } = await this.#_instance.get('/v1/user/games/383060');
      return data.userGames[0].gameId;
    } catch (e) {
      console.error(e);
    }
  }

  async getSquad() {
    try {
      const lastGame = await this.lastGame();
      const { data } = await this.#_instance.get(`/v1/games/${lastGame}`);

      
      const a = data.userGames.find(e => e.nickname === "nica");
      const b = data.userGames.filter(e => e.teamNumber === a.teamNumber)
      const characterNums = b.map(e => e.characterNum);

      const charactersData = await this.characters(characterNums);
  
      let squad = [];
      for (const i of b) {
        const characterName = charactersData[i.characterNum] || "Character not found";
        squad.push(`${i.nickname} (${characterName})`);
      }

      return squad.join(', ');
    } catch (e) {
      console.error(e);
    };
  }

  async characters(characterNums) {
    try {
      const { data } = await this.#_instance.get('/v2/data/Character');
      const charactersData = {};
      for (const characterNum of characterNums) {
        const characterData = data.data.find(e => e.code === characterNum);
        charactersData[characterNum] = characterData ? characterData.name : "Character not found";
      }
      return charactersData;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

}