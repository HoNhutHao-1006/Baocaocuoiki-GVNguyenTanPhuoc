const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    ticketTierId: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketTier' },
    seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seat' },
    seatLabel: String,
    zoneName: String,
    zoneColor: String,
    // Multi-seat support
    seatIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }],
    seatLabels: [String],
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Held', 'Paid', 'Cancelled', 'CheckedIn'], default: 'Held' },
    qrCode: String,
    holdExpiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
