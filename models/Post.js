const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, ref:"user"},
  user_name: String,
  text:String,
  images:[Buffer] 
});

mongoose.model('posts', postSchema);
