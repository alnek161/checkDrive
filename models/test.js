const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testShema = new Schema({
  testId:{
  type: String,
  },
  topic:{
  type: Number,
  },
  glav:{
    type: String,
  },
  question:{
    type: String,
  },
  image:{
    type: String,
  },
  options:{
    type: Array,
  },
  rightOrtion:{
    type: Number,
  }
},);

const Test = mongoose.model('Test', testShema);

module.exports = Test;