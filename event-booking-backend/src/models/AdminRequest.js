const mongoose = require('mongoose');
const adminRequestSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['location_request', 'complaint', 'review', 'other'], default: 'other' },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
  adminNote: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });
module.exports = mongoose.model('AdminRequest', adminRequestSchema);
