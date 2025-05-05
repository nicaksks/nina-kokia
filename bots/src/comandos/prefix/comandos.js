const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {

	const embed = new EmbedBuilder()
	.setTitle('Comandos de Prefix da nina')
	.addFields(
		{ name: '!aniversario <args>', value: 
		`\`set\` - Seta a sua data de nascimento. 
		\`list\` - Verificar a lista de aniversariante.` },
		{ name: '!tts <mensagem>', value: 
		`Envie sua mensagem com a voz do **Google**. 
		Para enviar **TTS** é necessário ter o cargo **✦ ❝ ઇ TTS ⸝⸝ ۰ ⸼**` },
		{ name: '!apostar <time> <quantidade-de-estrelas>', value: 
		`Aposte no seu **time** favorito e tenha chance de receber suas **Estrelas** em dobro.` },
		{ name: '!tabela', value: 
		`Verificar quais time estão participando das apostas.` },
		{ name: 'ㅤ', value: 
		`Para mais informaçoes acesse a documentação da **[nina](https://ninabot.netlify.app)**` }
	)
	.setColor('#FFFFFF')
	return message.reply({ embeds: [embed] })
};