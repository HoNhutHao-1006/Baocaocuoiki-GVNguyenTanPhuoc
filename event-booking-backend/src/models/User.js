const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'ORGANIZER', 'EMPLOYEE', 'MEMBER'], required: true },
    status: { type: String, default: 'ACTIVE' },
    fullname: String,
    phone: String,
    email: String,
    avatar: { type: String, default: '' },
    bankName: { type: String, default: '' },
    bankAccount: { type: String, default: '' },
    emailVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: '' },
    verificationExpires: { type: Date },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }
}, { timestamps: true });

userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

module.exports = mongoose.model('User', userSchema);
