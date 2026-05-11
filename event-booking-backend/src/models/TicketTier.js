const mongoose = require('mongoose');

const ticketTierSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    tierName: { type: String, required: true },
    price: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    availableQuantity: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TicketTier', ticketTierSchema);
