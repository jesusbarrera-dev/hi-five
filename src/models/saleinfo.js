const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Product } = require('./product');
const { Payment } = require('./payment');

const SaleinfoSchema = new Schema({
  products: [{ type: Schema.ObjectId, ref: "Product" }],
  quantities: [{type: Number}],
  payment: { type: Schema.ObjectId, ref: "Payment" },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Saleinfo', 'SaleinfoSchema');