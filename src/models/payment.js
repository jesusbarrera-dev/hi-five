const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  cardnum: { type: Number, required: true },
  cvv: { type: Number, required: true },

});

module.exports = mongoose.model('Payment', 'PaymentSchema');