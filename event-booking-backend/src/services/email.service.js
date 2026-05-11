const nodemailer = require('nodemailer');

// Configure transporter — uses env vars or fallback to Ethereal test account
let transporter = null;

async function getTransporter() {
    if (transporter) return transporter;

    if (process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });
    } else {
        // Fallback: create Ethereal test account
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass }
        });
        console.log('[Email] Using Ethereal test account:', testAccount.user);
    }
    return transporter;
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(toEmail, code, fullname) {
    const t = await getTransporter();
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0B0B0F;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:500px;margin:40px auto;background:#16161E;border-radius:20px;border:1px solid rgba(0,240,255,0.2);overflow:hidden;">
        <div style="background:linear-gradient(135deg,#00F0FF,#FF00E5);padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;letter-spacing:2px;">LUMINA EMS</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Xác Thực Tài Khoản</p>
        </div>
        <div style="padding:35px 30px;text-align:center;">
          <p style="color:#ccc;font-size:16px;margin:0 0 8px;">Xin chào <strong style="color:#fff;">${fullname || 'bạn'}</strong>,</p>
          <p style="color:#999;font-size:14px;margin:0 0 30px;">Mã xác nhận đăng ký tài khoản của bạn:</p>
          <div style="background:rgba(0,240,255,0.08);border:2px solid #00F0FF;border-radius:16px;padding:24px;margin:0 auto 25px;max-width:280px;">
            <div style="font-size:42px;font-weight:900;letter-spacing:12px;color:#00F0FF;font-family:monospace;">${code}</div>
          </div>
          <p style="color:#666;font-size:13px;margin:0 0 6px;">Mã có hiệu lực trong <strong style="color:#F59E0B;">10 phút</strong></p>
          <p style="color:#555;font-size:12px;margin:0;">Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        </div>
        <div style="background:rgba(0,0,0,0.3);padding:18px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="color:#444;font-size:12px;margin:0;">© 2026 Lumina EMS. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>`;

    const info = await t.sendMail({
        from: `"Lumina EMS" <${process.env.GMAIL_USER || process.env.SMTP_USER || 'noreply@lumina.vn'}>`,
        to: toEmail,
        subject: `[Lumina EMS] Mã xác nhận: ${code}`,
        html: htmlBody
    });

    // Log preview URL for Ethereal
    if (info.messageId && !process.env.GMAIL_USER && !process.env.SMTP_HOST) {
        console.log('[Email] Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    return info;
}

module.exports = { generateVerificationCode, sendVerificationEmail };
