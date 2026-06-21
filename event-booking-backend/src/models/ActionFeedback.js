const mongoose = require('mongoose');

const actionFeedbackSchema = new mongoose.Schema({
    actionId: { type: String, required: true },
    isUseful: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ActionFeedback', actionFeedbackSchema);
