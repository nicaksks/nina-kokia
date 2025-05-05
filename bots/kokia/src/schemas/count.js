const { Schema, model } = require("mongoose");

const count = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  commandCount: {
    type: Number,
    default: 0
  }
});

module.exports = model("count", count);