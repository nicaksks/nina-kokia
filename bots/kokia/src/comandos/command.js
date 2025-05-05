const message = require('../../src/eventos/message');
const customCommands = require('../../src/schemas/commands.js');
const count = require('../../src/schemas/count.js');
const { nina } = require('../../src/util/config.json');

module.exports.run = async (channel, user, message, self, userstate) => {

  const args = self.split(' ');
  const command = args.shift();
  const options = args.shift();

  //Nome do comando.
  let commandName = args.shift().toLowerCase();
  commandName = commandName.startsWith(nina.prefix) ? commandName : `${nina.prefix}${commandName}`;

  //Verificar se o usuário é mod;
  const mod = message['user-type'] === 'mod' || message.username === nina.owner;

  //Descrição do comando.
  const commandResponse = args.join(' ');

  //Adicionar comando.
  if(mod) {
      if(options === "add") {

        //Verificar se o comando já existe
        const check = await customCommands.findOne({ name: commandName })
        if(check)
          return channel.say(user, `Esse comando já existe no banco de dados. Caso queira editar use: !command edit ${commandName} <mensagem>`)

        //Adicionando novo comando;
        const add = new customCommands({
          name: commandName,
          description: commandResponse
        });

        const contagem = new count({
          name: commandName
        });
        contagem.save();

        //Salvando o novo comando;
        add.save((err) => {
          //console.log(err)
          if (err) return channel.say(user, "Ocorreu um erro na hora de adicionar o comando no banco de dados.")
            return channel.say(user, `Comando adicionado com sucesso!`)
       });
    };
  };

  //Editar comando.
  if(mod) {
      if(options === "edit") {

        //Verificando se o comando existe;
        const edit = await customCommands.findOne({ name: commandName })
        if(!edit)
          return channel.say(user, `Esse comando não existe no banco de dados. Caso queira criar o comando use: !command add ${commandName} <mensagem>`)

        //Editando a descrição;
        edit.description = commandResponse

        //Salvando a nova descrição do comando;
        edit.save((err) => {
          //console.log(err)
          if (err) return channel.say(user, "Ocorreu um erro na hora de editar o comando no banco de dados.")
           return channel.say(user, `Comando editado com sucesso!`)
       });
    };
  };

  //Deletar comando.
  if(mod) {
    if(options === "delete") {

      //Verificando se o comando existe;
      const del = await customCommands.deleteOne({ name: commandName })
      await count.deleteOne({ name: commandName })
      if(!del) return channel.say(user, 'Esse comando não existe.');
      if(!del.ok) return channel.say(user, "Comando deletado com sucesso!");
    };
  };
};