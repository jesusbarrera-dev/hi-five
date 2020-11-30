const mongoose = require('mongoose');
const { Schema } = mongoose;
// const { ImageSchema } = require('./image');

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: Object }
});

module.exports = mongoose.model('Product', ProductSchema);