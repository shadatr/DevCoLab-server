const mongoose = require('mongoose');
const { Schema } = mongoose;

const imagesSchema = new Schema({
  image: String,
});

module.exports=imagesSchema
