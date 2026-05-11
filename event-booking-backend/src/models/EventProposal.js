const mongoose = require('mongoose');

const eventProposalSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventType: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
    expectedDate: { type: String, required: true },
    expectedLocation: { type: String, required: true },
    budget: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    reviewNote: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

eventProposalSchema.index({ memberId: 1 });
eventProposalSchema.index({ status: 1 });

module.exports = mongoose.model('EventProposal', eventProposalSchema);
