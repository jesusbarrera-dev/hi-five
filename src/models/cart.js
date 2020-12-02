const mongoose = require('mongoose');
const { Schema } = mongoose;
const { User } = require('./user');
const { Product } = require('./product');

const CartSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  products: [{ type: Schema.ObjectId, ref: "Product" }],
  quantities: [{type: Number}]
});

module.exports = mongoose.model('Cart', 'CartSchema');