const mongoose = require('mongoose');
const { Schema } = mongoose;
const { User } = require('./user');
const { Saleinfo } = require('./saleinfo');

const SaleSchema = new Schema({
  id: { type: Number, required: true },
  client: { type: Schema.ObjectId, ref: "User" },
  info: { type: Schema.ObjectId, ref: "Saleinfo" }
});

module.exports = mongoose.model('Sale', 'SaleSchema');