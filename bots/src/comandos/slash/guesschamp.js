const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const championData = require('../../../src/assets/guess/championData.json');
var AsciiTable = require('ascii-table');
const db = require('quick.db');
const ms = require("parse-ms");
const config = require('../../../src/util/config.json');
const boostRole = config['sub'][0].role;
const guildId = config['nina'][0].guildId;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adivinhe')
    .setDescription('[✂️] - Adivinhe o personagem.')
    .addStringOption(option => option
      .setName('personagem')
      .setDescription('Digite o nome de um personagem.')
      .setRequired(true)),
  async execute(interaction, message, client) {

    var daily = new db.table('daily');
    var gueesCheck = new db.table('verificar');
    var points = new db.table('points');

    let dailyF = await daily.get(`guess_${interaction.user.id}`);

    let checkMember = await gueesCheck.get(`guess_${interaction.user.id}`);

    //String;
    const campeao = await interaction.options.getString('personagem').toLowerCase();

    const correto = "🟩";
    const negativo = "🟥";
    const neutro = "🟧";
    const up = "⬆️";
    const down = "⬇️";

    let cnome = "";
    let cgenero = "";
    let crota = "";
    let cespecie = "";
    let cresource = "";
    let ctype = "";
    let cregion = "";
    let crelease = "";

    for(let i=0; i < championData.length; i++) {

      check = championData[i].championName.toLowerCase();

      if(check === campeao) {
        cnome = championData[i].championName
        cgenero = championData[i].gender;
        crota = championData[i].positions;
        cespecie = championData[i].species;
        cresource = championData[i].resource;
        ctype = championData[i].range_type;
        cregion = championData[i].regions;
        crelease = championData[i].release_date;
      }
    }

    if(!cnome)
      return interaction.reply({ content: `**${campeao}** não existe no banco de dados.`, ephemeral: true});

    //Tempo da recompensa diária resetada;
    const personagem = championData[Math.floor(Math.random() * championData.length)];

    const cd = 86400000; //86400000 - 24 horas.
    if(dailyF !== null && cd - (Date.now() - dailyF) > 0) {
      let time = (cd - (Date.now() - dailyF));
    } else {
      daily.set(`guess_${interaction.user.id}`, Date.now());
      daily.set(`guess_daily_${interaction.user.id}`, championData[Math.floor(Math.random() * championData.length)]);
      gueesCheck.delete(`guess_${interaction.user.id}`);
    }

    let time = ms(cd - (Date.now() - dailyF));
    let tempRestante = "";

    if(time.minutes <= -0) {
      tempRestante = 'Sua tentativa de hoje já está disponível. \nDigite o comando novamente.'
    } else {
      tempRestante = `Você já respondeu a pergunta de hoje. \nSuas próximas tentativas vão está disponível em **${time.hours}** hora(s) **${time.minutes}** minuto(s) e **${time.seconds}** segundo(s)`;
    }

    if(checkMember)
      return interaction.reply({ content: tempRestante, ephemeral: true });

    let dailyPersonagem = daily.get(`guess_daily_${interaction.user.id}`);
    let nome = dailyPersonagem.championName;
    let genero = dailyPersonagem.gender;
    let rota = dailyPersonagem.positions;
    let especie = dailyPersonagem.species;
    let resource = dailyPersonagem.resource;
    let type = dailyPersonagem.range_type;
    let region = dailyPersonagem.regions;
    let release = dailyPersonagem.release_date;

    let fgenero = "";
    let frota = "";
    let fespecie = "";
    let fresource = "";
    let ftype = "";
    let fregion = "";
    let frelease = "";

    genero === cgenero ? fgenero = correto : fgenero = negativo;
    resource === cresource ? fresource = correto : fresource = negativo;

    if(rota === crota) {
      frota =  correto;
    } else if (rota[1] === crota[1]) {
      frota =  neutro;
    } else {
      frota =  negativo;
    };

    if(especie === cespecie) {
      fespecie = correto;
    } else if (especie[1] === cespecie[1]) {
      fespecie = neutro;
    } else {
      fespecie = negativo;
    };

    if(type === ctype) {
      ftype = correto;
    } else if (type[1] === ctype[1]) {
      ftype = neutro;
    } else {
      ftype = negativo;
    };

    if(region === cregion) {
      fregion = correto;
    } else if (region[1] === cregion[1]) {
      fregion = neutro;
    } else {
      fregion = negativo;
    };

    const data =  new Date(release)
    const cdata = new Date(crelease)

    data > cdata ? frelease =  up : frelease = down;

    var tabela = new AsciiTable(`Adivinhe o Personagem. | ${interaction.user.username}`)
    tabela.setHeading('', 'Correto', 'Tentativa')
    tabela.addRow(1, nome, cnome)
    tabela.addRow(2, genero, cgenero)
    tabela.addRow(3, rota, crota)
    tabela.addRow(4, especie, cespecie)
    tabela.addRow(5, resource, cresource)
    tabela.addRow(6, type, ctype)
    tabela.addRow(7, region, cregion)
    tabela.addRow(8, release, crelease)
    const debbuger = tabela.toString()

    //console.log(debbuger)

    const embed = new EmbedBuilder()

    let checkUser = interaction.guild.members.cache.get(interaction.user.id);
    let checkRole = checkUser.roles.cache.some(role => role.id === boostRole);

    if(nome === cnome) {
      if(checkRole) {
        embed.setTitle('Resposta Correta.')
        embed.setDescription(`O Personagem de hoje erá **${nome}** \n+ **5 Estrela(s)** por ter acertado a resposta. \n+ **5 Estrela(s)** por está **BOOSTADO**.`)
        embed.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.17.1/img/champion/${nome.replace(/\s/g, '%20')}.png`)
        embed.setColor("#00FF00")
        gueesCheck.add(`guess_${interaction.user.id}`, 1);
        points.add(`points_${interaction.user.id}`, 10);
        return interaction.reply({ embeds: [embed], ephemeral: false });
      } else {
        embed.setTitle('Resposta Correta.')
        embed.setDescription(`O Personagem de hoje erá **${nome}** \nVocê está recebendo **5 Estrela(s)**`)
        embed.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.17.1/img/champion/${nome.replace(/\s/g, '%20')}.png`)
        embed.setColor("#00FF00")
        gueesCheck.add(`guess_${interaction.user.id}`, 1);
        points.add(`points_${interaction.user.id}`, 5);
        return interaction.reply({ embeds: [embed], ephemeral: false });  
      }
    } else {
      embed.setTitle('Resposta Incorreta.')
      embed.setDescription(`

        **Personagem:** \`${cnome}\`
        **Gênero**: \`${cgenero} - ${fgenero}\` 
        **Rota:** \`${crota} - ${frota}\`
        **Especie:** \`${cespecie} - ${fespecie}\`
        **Usa?** \`${cresource} - ${fresource}\`
        **Alcance:** \`${ctype} - ${ftype}\`
        **Região:** \`${cregion} - ${fregion}\`
        **Lançamento:** \`${crelease} - ${frelease}\`

        **Acertos e Erros**
        ${fgenero} | ${frota} | ${fespecie} | ${fresource} | ${ftype} | ${fregion} | ${frelease}`)      
      embed.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.17.1/img/champion/${cnome.replace(/\s/g, '%20')}.png`)
      embed.setColor("#CF2E2E")
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};