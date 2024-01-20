const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  imageText: {
    type: String,
    required: true
  },
  image:{
    type:String,


  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array,
    default:[],
  },
  user:{
    //  here we are getting the user id of that person who post

    type:Schema.Types.ObjectId,
    ref:"User",
    

  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
