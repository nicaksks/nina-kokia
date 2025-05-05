const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('quick.db');
const config = require('../../../src/util/config.json');
const cdn = config['cdn'][0].url;

exports.run = async (client, message, args) => {

	if (message.author.id === "226393792335314945") {

		//Caso o usuário não cite uma opção;
		if(!args.length)
			return message.reply('Para adicionar uma **carta** nova você precisa adicionar as **opções**.');

		//Opções;
		let option = args.splice(0, 1)[0].toLowerCase();

		//Banco de dados;
   		const waifu = new db.table('waifu');
   		const totalWaifu = waifu.all().filter(data => data.ID);
   		const newID = totalWaifu.length + 1

		let idDefault = newID
		let id = `${newID}`
		let name = args[0];
		let image = cdn + args[0] + ".png";
		let tier = 'Comum'
		let power = 10;
		let defense = 10;
		let coins = 10;
		let game = "Eternal Return";

		if(option === 'add') {

			//Verificar se é um tier válido;
			const availlablesTiers = ['Comum', 'Incomum', 'Rara', 'Epica', 'Mítica', 'Lendária']
      		if(!availlablesTiers.find(availlableTier => availlableTier === tier)) 
      			return message.reply(`**Tier** inválido. \n**Tiers** válidos: **${availlablesTiers.join(', ').replace(/, ([^,]*)$/, ' ou $1')}**.`);

      		//Images
    		const tagImage = {
    			"Comum": "<:Common:988552878690013274>",
        		"Incomum": "<:Uncommon:988531069789827192>",
        		"Rara": "<:Rare:988552884415262790>",
        		"Epica": "<:Epic:988552879516303381>",
        		"Mítica": "<:Mythic:988552882783670314>",
        		"Lendária": "<:Legend:988552881336635472>"
        	}

    		//Filter;
    		const filter = i => ['adicionar', 'deletar'].includes(i.customId);
    		const collector = message.channel.createMessageComponentCollector({ filter, time: 15000, erros: ['time'] });

    		//Collector;
    		collector.on('collect', async i => {
    			if(i.customId === 'adicionar') {

    				const embedAdd = new EmbedBuilder()
    				.setTitle(`Carta ${name} foi criada com sucesso!`)
      				.setDescription(`**STATUS** \n\`Ataque:\` **${power}** <:AttackPower:988530495237292072> **|** \`Defesa:\` **${defense}** <:Defense:988531421045997658> \n\n**INFORMAÇÕES** \n\`A-coin:\` **${coins}** <:ACoin:988530798179270656> \n\`Tier:\` **${tier}** ${tagImage[tier]}`)
      				.setImage(image)
    				.setColor('#5FCF2E')
    				i.update({ embeds: [embedAdd], components: [] });
    				waifu.set(`${id}`, { id: idDefault, name: name, coins: coins, owner: `0`, ownerTag: '0', owned: "0", image: image, power: power, defense: defense, tier: tier, game: game });
    				collector.stop()
    			}

    			if(i.customId === 'deletar') {
    				embed.setTitle('A criação dessa carta foi cancelada.')
    				embed.setColor('#CF2E2E')
    				i.update({ embeds: [embed], components: [] });
    				collector.stop()
    			}
    		});

        	//Embed
      		const embed = new EmbedBuilder()
      		.setTitle(`${name} ${tagImage[tier]}`)
      		.setDescription(`**STATUS** \n\`Ataque:\` **${power}** <:AttackPower:988530495237292072> **|** \`Defesa:\` **${defense}** <:Defense:988531421045997658> \n\n**INFORMAÇÕES** \n\`A-coin:\` **${coins}** <:ACoin:988530798179270656> \n\`Tier:\` **${tier}** ${tagImage[tier]}`)
      		.setImage(image)
      		.setColor("#FFFFFF")

      		 //Botão para adicionar a carta;
    		let button = new ActionRowBuilder()
    		.addComponents( new ButtonBuilder()
    			.setCustomId('adicionar')
      			.setEmoji('✅')
      			.setStyle(ButtonStyle.Success))
      		.addComponents( new ButtonBuilder()
      			.setCustomId('deletar')
      			.setEmoji('❌')
      			.setStyle(ButtonStyle.Danger));
      		message.channel.send({ embeds: [embed], components: [button], fetchReply: true })
		}
	} else {
		message.reply(`A criação de novas **cartas** não está disponível.`)
	}
};