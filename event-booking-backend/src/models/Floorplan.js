const mongoose = require('mongoose');

const seatZoneSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name:  { type: String, required: true },
    zoneColor: { type: String, default: '#00F0FF' },
    price: { type: Number, required: true },
    rows: { type: Number, default: 5 },
    seatsPerRow: { type: Number, default: 10 }
}, { timestamps: true });

const seatSchema = new mongoose.Schema({
    eventId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    zoneId:   { type: mongoose.Schema.Types.ObjectId, ref: 'SeatZone', required: true },
    row:      { type: String, required: true },
    number:   { type: Number, required: true },
    label:    { type: String, required: true },
    status:   { type: String, enum: ['available', 'held', 'booked'], default: 'available' },
    heldBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    heldUntil: Date
}, { timestamps: true });

seatSchema.index({ eventId: 1, zoneId: 1 });
seatSchema.index({ eventId: 1, status: 1 });
seatZoneSchema.index({ eventId: 1 });

const SeatZone = mongoose.model('SeatZone', seatZoneSchema);
const Seat = mongoose.model('Seat', seatSchema);

module.exports = { SeatZone, Seat };
