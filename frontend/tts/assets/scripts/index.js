const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true,
	},
	channels: ['anniesemtrema']
});

client.on('connected', () => {
    console.log('Conectado com sucesso.')
})

client.on('message', async (channel, tags, message, self) => {
    
    if(self) return;
    if(tags['custom-reward-id'] === "0698b60b-fa95-4cbf-b287-50c2706195a7") {

        var voices = window.speechSynthesis.getVoices();
        var mensagem = new SpeechSynthesisUtterance();
    
        mensagem.voice = voices[5];
        mensagem.text = message
 
        document.getElementById("tts").innerHTML = await speechSynthesis.speak(mensagem) || "";
    }
});

client.connect()
