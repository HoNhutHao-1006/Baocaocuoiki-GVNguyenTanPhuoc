const mongoose = require('mongoose');

const aiInsightsCacheSchema = new mongoose.Schema({
    key: { type: String, default: 'latest', unique: true },
    insights: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AIInsightsCache', aiInsightsCacheSchema);
