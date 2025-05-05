const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("quick.db");

exports.run = async (client, message, args) => {

    //Aviso;
    if(!args.length)
        return message.reply(`Você esqueceu de adicionar a **data** do seu aniversário. \nExemplo: **!aniversario set 21/01/1999**`)

    //Banco de dados;
    var aniversario = new db.table('aniversario');
    const aniversariantes = aniversario.all().filter(data => data.ID);
    const newID = aniversariantes.length + 1

    //Data formada;
    var date = new Date(); 
    var dias = String(date.getDate()).padStart(2, '0')
    var meses = String(date.getMonth() + 1).padStart(2, '0')
    var ano = date.getFullYear()
    const definido = dias + "/" + meses;

    const nomedosMeses = {
        "01": "Janeiro",
        "02": "Fevereiro",
        "03": "Março",
        "04": "Abril",
        "05": "Maio",
        "06": "Junho",
        "07": "Julho",
        "08": "Agosto",
        "09": "Setembro",
        "10": "Outubro",
        "11": "Novembro",
        "12": "Dezembro"
    }

    //Args;
    let option = args.splice(0, 1)[0].toLowerCase()

    //Adicionar uma data de aniversário
    if(option === 'set') {
        if(args.length) {

            const data = args[0];
            if(data.length < 10) return message.reply('A sua data de **aniversário** tem que ser igual **!aniversario set 21/01/1999**');
            if(data.length > 10) return message.reply('A sua data de **aniversário** tem que ser igual **!aniversario set 21/01/1999**');

            const match = data.match(/^[\d\/]+$/)
            if(match == null) return message.reply('Você só pode digitar números.');

            for (let i=1; i <= aniversariantes.length; ++i) {
                check = aniversario.get(`${i}`)
                name = check.name

                if(name === message.author.id) {
                    return message.reply('Você já cadastrou o seu aniversário.')
                }
            }

            message.reply('Sua data de **aniversário** foi salva com sucesso!')
            aniversario.set(`${newID}`, { name: message.author.id, data: data });
        }
    }

    if(option === 'list') {

        let name = "";
        let data = "";
        let mesatual = "";
        let adm = "";

        for (let i=1; i <= aniversariantes.length; ++i) {
            check = aniversario.get(`${i}`)
            name += `<@${check.name}>\n`;
            data += `${check.data}\n`;
        }

        for (let i=1; i <= aniversariantes.length; ++i) {
            checkk = aniversario.get(`${i}`)
            namee = `<@${checkk.name}>\n`;
            dataa = `${checkk.data}\n`;

            dia = dataa.split("/")[0];
            mes = dataa.split("/")[1];
            anos = dataa.split("/")[2];

            if(mes === meses) {
                mesatual += `${dia}/${mes}/${anos}`;
                adm += `<@${checkk.name}>\n`;
            }
        }

        //Filtro
        const filter = i => ['mes', 'lista'].includes(i.customId) && i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, errors: ['time'] });

        collector.on('collect', async i => {
            if(i.customId === "mes") {

                const embed1 = new EmbedBuilder()
                .setTitle(`Aniversáriantes do mês de ${nomedosMeses[meses]}`)
                .addFields({ name: 'NOME', value: adm || 'Não temos nenhum **aniversáriante** esse mês.', inline: true })
                .addFields({ name: 'DATA', value: mesatual || '<a:pepelaptop:1001527275537318009>' , inline: true })
                .setColor("#FFFFFF")
                return i.update({ embeds: [embed1], components: [button] });
            };
            if(i.customId === "lista") {

                const embed2 = new EmbedBuilder()
                .setTitle('Lista dos aniversariantes')
                .addFields({ name: 'NOME', value: name, inline: true })
                .addFields({ name: 'DATA', value: data, inline: true })
                .setColor("#FFFFFF")
                return i.update({ embeds: [embed2], components: [button] });
            };
        });

        let button = new ActionRowBuilder()
        .addComponents( new ButtonBuilder()
            .setCustomId('mes')
            .setLabel(nomedosMeses[meses])
            .setStyle(ButtonStyle.Secondary))
        .addComponents( new ButtonBuilder()
            .setCustomId('lista')
            .setLabel('Lista')
            .setStyle(ButtonStyle.Secondary));

        const embed = new EmbedBuilder()
        .setDescription(`Selecicone um botão para prosseguir. \n\n**AVISO**\nNão esqueça de enviar um **parabéns** para os **aniversariantes** do mês de **${nomedosMeses[meses]}** 🥳`)
        .setColor('#FFFFFF')
        return message.channel.send({ embeds: [embed], components: [button] });
    }
}