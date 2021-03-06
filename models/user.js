const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  nickname:{
    type: String,
    required: false
  },
  country:{
    type: String,
    required: false
  },
  purpose:{
    type: String,
    required: false
  },
  overallskill:{
    type: String,
    required: false
  },
  timefrom:{
    type: String,
    required: false
  },
  timeto:{
    type: String,
    required: false
  },
  timezone:{
    type: String,
    required: false
  },
  discord:{
    type: String,
    required: false
  },
  steam:{
    type: String,
    required: false
  },
  game:{
    type: String,
    required: false
  },
  groupsize:{
    type: String,
    required: false
  },
  searching:{
    type: String,
    required: false
  }
});

const User = module.exports = mongoose.model('User', UserSchema);
