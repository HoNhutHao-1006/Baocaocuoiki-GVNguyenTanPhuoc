const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventProposal' },
    name: { type: String, required: true },
    email: String,
    phone: String,
    status: { type: String, enum: ['Pending', 'Sent', 'Confirmed', 'Declined', 'CheckedIn'], default: 'Pending' },
    dietary: String,
    plusOnes: { type: Number, default: 0 },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    note: String,
    qrCode: String,
    sentAt: Date
}, { timestamps: true });

rsvpSchema.index({ memberId: 1 });
rsvpSchema.index({ proposalId: 1 });
rsvpSchema.index({ eventId: 1 });

module.exports = mongoose.model('Rsvp', rsvpSchema);
