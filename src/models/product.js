const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ImageSchema } = require('./image');

const ProductSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  style: { type: String, required: true },
  image: { type: ImageSchema }
});

module.exports = mongoose.model('Product', ProductSchema);