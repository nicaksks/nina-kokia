const { EmbedBuilder } = require('discord.js');
const os = require('os');

exports.run = async (client, message, args) => {

  function uptime() {
    let totalSegundos = (client.uptime / 1000);
    let dias = Math.floor(totalSegundos / 86400);
    totalSegundos %= 86400;
    let horas = Math.floor(totalSegundos / 3600);
    totalSegundos %= 3600;
    let minutos = Math.floor(totalSegundos / 60);
    let segundos = Math.floor(totalSegundos % 60);

    let time
    if(dias >= 1) {
      time = `**${dias}d, ${horas}h, ${minutos}m e ${segundos}s.**`
    } else if (horas >= 1) {
      time = `**${horas}h, ${minutos}m e ${segundos}s.**`
    } else if (minutos >= 1) {
      time = `**${minutos}m e ${segundos}s.**`
    } else if (segundos >= 1) {
      time = `**${segundos}s.**`
    } else {
      time = '**Carregando...**'
    }
    return time;

  };

  function ram() {
    const disponivel = os.freemem();
    const total = os.totalmem();

    const porcentagem = (disponivel / total) * 100 + "%";
    return porcentagem.slice(0, 2);
  }

  const embed = new EmbedBuilder()
  .setTitle('Nina & Kokia')
  .setDescription(`**Nina & Kokia** estão sendo hospedadas atualmente na **[HostSquare](https://hostsquare.com.br)**`)
  .addFields({ name: '⏰ Uptime', value: uptime(), inline: true })
  .addFields({ name: '💾 Memória RAM', value: `**${ram()}%**`, inline: true })
  .setColor('#FFFFFF')
  message.reply({ embeds: [embed] })
};