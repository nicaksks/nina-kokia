const { SlashCommandBuilder } = require('discord.js');
const db = require("quick.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dado')
    .setDescription('[✂️] - Dado viciado.')
    .addStringOption(option => option
      .setName('numero')
      .setDescription('Digite um número de 1 a 20')
      .setRequired(true)),
  async execute(interaction) {

    const number = await interaction.options.getString('numero');
    const dado = Math.floor(Math.random() * (20 - 1 + 1)) + 1;

    //db
    const check = await db.fetch(`chaves_${interaction.user.id}`);
    const itens = new db.table('itens');

    if (check < 15) {
		return interaction.reply(`Você não possui **chaves** suficientes. \nAtualmente você possui **${check} chave(s)** \nPara rodar o **dado** é necessário **15 chaves**`);
    }
      
   if (isNaN(number) || number < 1 || number > 20) {
  		return interaction.reply("Digite um número válido entre 1 e 20.");
	};

    db.subtract(`chaves_${interaction.user.id}`, 15);

    if (number === dado) {
      return interaction.reply(`
    <@${interaction.user.id}>, você acertou o número! \nO número que você escolheu foi **${number}** \nO número que saiu foi o **${dado}** \nVocê ganhou **300 de NP EVENT**. O **300 de NP EVENT** foi adicionado ao seu </inventario:1015265530317389831>.`)
        .then(() => {
          itens.add(`1_${interaction.user.id}`, 1);
        });
    } else {
      return interaction.reply(`<@${interaction.user.id}> você perdeu! \nO número que você escolheu foi **${number}** \nO número que saiu foi **${dado}**`);
    };
  },
};