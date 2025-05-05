const { Schema, model } = require("mongoose");

const sorteio = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
});

module.exports = model("sorteio", sorteio);