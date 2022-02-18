const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onlinePlayersSchema = new Schema({
  available: {
    type: Boolean,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  idSocket: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  disable: {
    type: Boolean,
    required: false,
  },
  option: {
    type: String,
    required: false,
  },
  flagSign1: {
    type: Boolean,
    required: false,
  },
  flagSign2: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model('OnlinePlayers', onlinePlayersSchema);
