const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    title: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    coverImg: String,
    description: { type: String, default: '' },
    location: String,
    eventType: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
    ticketingEnabled: { type: Boolean, default: true }
}, { timestamps: true });

eventSchema.index({ organizerId: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema);
