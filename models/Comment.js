const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, ref:"user"},
  text:String,
  post_id:{type: Schema.Types.ObjectId, ref:"posts"},
  user_name: String
});

mongoose.model('comments', commentSchema);
