const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  capacity: { type: Number }
});
module.exports = mongoose.model('Location', locationSchema);
