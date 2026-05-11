const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventProposal' },
    details: { type: String, required: true },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Deposited', 'Paid', 'Cancelled'], default: 'Pending' },
    fileUrl: { type: String, default: '' },
    fileName: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contract', contractSchema);
