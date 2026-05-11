const { authenticator } = require('otplib');
const QRCode = require('qrcode');

/**
 * Tạo Secret key cho người dùng (nếu cần dùng 2FA/Staff checkin)
 */
const generateSecret = () => {
    return authenticator.generateSecret();
};

/**
 * Tạo mã QR động dựa trên TOTP
 * @param {string} ticketId - ID của vé
 * @param {string} secret - Secret key
 */
const generateDynamicQR = async (ticketId, secret) => {
    const otp = authenticator.generate(secret);
    const payload = JSON.stringify({ ticketId, otp });
    const qrImage = await QRCode.toDataURL(payload);
    return { otp, qrImage };
};

/**
 * Kiểm tra mã OTP
 */
const verifyOTP = (secret, token) => {
    return authenticator.verify({ token, secret });
};

module.exports = {
    generateSecret,
    generateDynamicQR,
    verifyOTP
};
