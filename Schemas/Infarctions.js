const { model, Schema } = require("mongoose");

module.exports = model(
  "Infarctions",
  new Schema({
    Guild: String,
    User: String,
    Infarctions: Array,
  })
);
