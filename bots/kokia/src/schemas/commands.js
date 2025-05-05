const { Schema, model } = require("mongoose");

const customCommands = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true

  },
  description: {
    type: String,
    required: true
  }
});

module.exports = model("customCommands", customCommands);