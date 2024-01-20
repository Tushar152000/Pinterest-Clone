const mongoose = require('mongoose');
const  plm =require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  posts: [{
    type:Schema.Types.ObjectId,
    ref:"Post",

  }],
  dp: {
    type: String // Assuming dp is a URL or a base64 encoded image string
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  }
});
userSchema.plugin(plm);


const User = mongoose.model('User', userSchema);

module.exports = User;
