const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  option: {
    type: String,
    required: false,
  },
  difficulty: {
    type: String,
    required: false,
  },
  namePlayer1: {
    type: String,
    required: false,
  },
  namePlayer2: {
    type: String,
    required: false,
  },
  wins1: {
    type: Number,
    required: false,
  },
  wins2: {
    type: Number,
    required: false,
  },
  draws: {
    type: Number,
    required: false,
  },
  email1: {
    type: String,
    required: false,
  },
  email2: {
    type: String,
    required: false,
  },
});

// const Result = mongoose.model('Result', resultSchema);

// Result.collection.dropIndex({ email2: 1 });

module.exports = mongoose.model('Result', resultSchema);
