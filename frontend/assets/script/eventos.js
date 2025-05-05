var eventos = [
    ["Quizㅤㅤﾠㅤ",["10:00","11:00","12:00"]],
    ["Cartinhas",["20:45"]],
    ["Meiji vs JP",["17:30"]]
];

function definido(horas, minutos, segundos) {
    return horas * 3600 + minutos * 60 + segundos;
}

function update()
{
    var data = new Date();
    var tempo = definido(data.getHours(), data.getMinutes(), data.getSeconds());

    var html = '';
    for (i in eventos) {
        var j;
        for (j=0; j<eventos[i][1].length; j++) {
            var t = eventos[i][1][j].split(':');
            t = definido(t[0],t[1],0);
            if(t > tempo) break;
        }

        j = j%eventos[i][1].length;
        var t = eventos[i][1][j].split(':');

        var diff = definido(t[0],t[1],0) - tempo;
        if(diff < 0) diff += 3600*24;

        var horas = parseInt(diff/3600);
        diff -= 3600 * horas;
        var minutos = parseInt(diff/60);
        var segundos = diff - minutos * 60;

        var countdown = ("0" + horas).slice(-2) +':'+("0" + minutos).slice(-2)+':'+("0" + segundos).slice(-2);

        html += '<div id="time">'+eventos[i][0]+'ㅤㅤㅤ'+countdown+'</div>';
        document.getElementById("time").innerHTML = html
    }
}

setInterval(update, 1000);
