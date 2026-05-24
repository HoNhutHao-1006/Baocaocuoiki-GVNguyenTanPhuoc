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

async function sendEventInvitationEmail(toEmail, { guestName, eventTitle, eventDescription, eventDate, eventLocation, senderName, senderPhone, senderEmail, qrCode, eventId }) {
    const t = await getTransporter();
    const rsvpUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?rsvp=${eventId}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCode}`;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thư Mời Tham Dự Sự Kiện</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f6f8;padding: 40px 0;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.05);border:1px solid #e1e8ed;overflow:hidden;">
              <!-- Header Banner -->
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#1e3c72 0%,#2a5298 100%);padding:40px 30px;color:#ffffff;">
                  <h1 style="margin:0;font-size:26px;font-weight:700;letter-spacing:1px;font-family:'Outfit','Segoe UI',sans-serif;">LUMINA EMS</h1>
                  <p style="margin:10px 0 0 0;font-size:14px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:2px;">THƯ MỜI TRÂN TRỌNG</p>
                </td>
              </tr>
              <!-- Content Body -->
              <tr>
                <td style="padding:40px 30px;color:#333333;font-size:15px;line-height:1.6;">
                  <p style="margin:0 0 20px 0;font-size:16px;">Kính gửi Anh/Chị <strong style="color:#1e3c72;font-size:17px;">${guestName}</strong>,</p>
                  
                  <p style="margin:0 0 20px 0;">Thay mặt ban tổ chức, chúng tôi trân trọng kính mời Anh/Chị tham dự sự kiện chuyên đề:</p>
                  
                  <h2 style="margin:0 0 20px 0;font-size:20px;color:#111111;font-weight:700;line-height:1.4;font-family:'Outfit','Segoe UI',sans-serif;">${eventTitle}</h2>
                  
                  ${eventDescription ? `
                  <div style="background-color:#f8fafc;border-left:4px solid #1e3c72;padding:15px 20px;margin:20px 0;border-radius:0 8px 8px 0;color:#555555;font-style:italic;">
                    ${eventDescription.replace(/\n/g, '<br/>')}
                  </div>
                  ` : ''}
                  
                  <div style="background-color:#f1f5f9;border-radius:10px;padding:20px;margin:25px 0;">
                    <h3 style="margin:0 0 12px 0;font-size:15px;color:#1e3c72;text-transform:uppercase;letter-spacing:1px;">📅 Thông Tin Sự Kiện</h3>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;color:#444444;">
                      <tr>
                        <td width="30" valign="top" style="padding-bottom:10px;">📅</td>
                        <td style="padding-bottom:10px;"><strong>Thời gian:</strong> ${eventDate}</td>
                      </tr>
                      <tr>
                        <td width="30" valign="top">📍</td>
                        <td><strong>Địa điểm:</strong> ${eventLocation}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- QR Code section -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:30px 0;background-color:#ffffff;border:1px dashed #cbd5e1;border-radius:10px;padding:20px;text-align:center;">
                    <tr>
                      <td align="center">
                        <img src="${qrImageUrl}" alt="Mã QR Check-in" width="150" height="150" style="display:block;border:5px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.1);" />
                        <p style="margin:15px 0 0 0;font-size:13px;color:#64748b;font-weight:600;">MÃ QR CHECK-IN CỦA BẠN</p>
                        <p style="margin:4px 0 0 0;font-size:12px;color:#94a3b8;">Vui lòng xuất trình mã này tại quầy đón tiếp để check-in vào sự kiện.</p>
                      </td>
                    </tr>
                  </table>

                  <!-- RSVP CTA Button -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:30px 0;text-align:center;">
                    <tr>
                      <td align="center">
                        <a href="${rsvpUrl}" target="_blank" style="background:linear-gradient(135deg,#1e3c72 0%,#2a5298 100%);color:#ffffff;padding:14px 30px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700;font-size:15px;box-shadow:0 4px 15px rgba(30,60,114,0.3);letter-spacing:0.5px;">XÁC NHẬN THAM DỰ (RSVP)</a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top:10px;">
                        <span style="font-size:12px;color:#94a3b8;">(Vui lòng nhấn nút trên để xác nhận tham dự trước ngày sự kiện diễn ra)</span>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin:25px 0 0 0;">Rất mong được đón tiếp Anh/Chị tại sự kiện.</p>
                  
                  <!-- Signature -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:35px;padding-top:20px;border-top:1px solid #f1f5f9;font-size:14px;color:#64748b;">
                    <tr>
                      <td>
                        Trân trọng,<br/>
                        <strong style="color:#1e3c72;font-size:15px;">${senderName}</strong><br/>
                        ${senderPhone ? `📞 Hotline: ${senderPhone}<br/>` : ''}
                        ${senderEmail ? `📧 Email: ${senderEmail}` : ''}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer Footer -->
              <tr>
                <td align="center" style="background-color:#f8fafc;padding:20px 30px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;">
                  <p style="margin:0 0 5px 0;">Email này được gửi tự động bởi hệ thống quản lý sự kiện <strong>Lumina EMS</strong>.</p>
                  <p style="margin:0;">© 2026 Lumina EMS. Mọi quyền được bảo lưu.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

    const info = await t.sendMail({
        from: `"Lumina EMS" <${process.env.GMAIL_USER || process.env.SMTP_USER || 'noreply@lumina.vn'}>`,
        to: toEmail,
        subject: `[Lời mời] Trân trọng kính mời tham dự: ${eventTitle}`,
        html: htmlBody
    });

    return info;
}

module.exports = { generateVerificationCode, sendVerificationEmail, sendEventInvitationEmail };
