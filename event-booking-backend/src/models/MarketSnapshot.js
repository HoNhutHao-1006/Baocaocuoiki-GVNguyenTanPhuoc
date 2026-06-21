const mongoose = require('mongoose');

const marketSnapshotSchema = new mongoose.Schema({
    source: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('MarketSnapshot', marketSnapshotSchema);
