const { readdirSync } = require('fs');

module.exports = (client) => {
    readdirSync('./src/eventos/').forEach(dir => {
        const events = readdirSync(`./src/eventos/${dir}`).filter(file => file.endsWith('.js'));
        for(let file of events) {
            let pull = require(`../../src/eventos/${dir}/${file}`);
        }
    });
};