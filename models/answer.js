const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerShema = new Schema({
  login:{
  type: String,
  },
  text: [{
    testId:{
        type: String,
    },
    topic:{
      type: Number,
    },
    glav:{
      type: String,
    },
    answer:{
        type: Number,
    },
    status:{
      type: Boolean,
    }
  }]
  
});

const Answer = mongoose.model('Answer', answerShema);

module.exports=Answer;