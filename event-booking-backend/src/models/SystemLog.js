const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    type: { type: String, enum: ['API_REQUEST', 'ERROR'], required: true },
    endpoint: { type: String, required: true },
    responseTime: { type: Number }, // in seconds
    module: { type: String }, // e.g. 'Payment Module', 'Auth Service', 'Booking Service'
    errorMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SystemLog', systemLogSchema);
