const mongoose = require("mongoose");

module.exports = function dbConnect() {
  mongoose.connect("mongodb+srv://login:password@cluster0.xchjp.mongodb.net/kokia?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('Banco de dados online.');
  })
  .catch((e) => {
    console.log('Ocorreu um problema na conexão do banco de dados.')
  });
};