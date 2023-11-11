const mongoose = require('mongoose');
const { Schema } = mongoose;
const imagesSchema= require('./Images');

const userSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, ref:"user"},
  user_name: String,
  text:String,
  images:[String]
});

mongoose.model('posts', userSchema);
