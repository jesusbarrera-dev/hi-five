const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('Image', ImageSchema);