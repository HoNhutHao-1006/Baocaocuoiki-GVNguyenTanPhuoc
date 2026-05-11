const mongoose = require('mongoose');
const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  image: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Device', deviceSchema);
