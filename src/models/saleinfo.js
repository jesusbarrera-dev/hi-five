const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Product } = require('./product');
const { Payment } = require('./payment');

const SaleinfoSchema = new Schema({
  products: [{ type: Schema.ObjectId, ref: "Product" }],
  payment: { type: Schema.ObjectId, ref: "Payment" },
  date: { type: Date, default: Date.now() },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true }
});

module.exports = mongoose.model('Saleinfo', 'SaleinfoSchema');