const nodemailer = require("nodemailer");

let transporter = null;

try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
} catch (err) {
  console.warn("Nodemailer transport init warning:", err.message);
}

exports.sendNotificationEmail = async ({ to, subject, text, html }) => {
  try {
    if (!to) return;
    if (!transporter) {
      console.log(`[Email Notification Mock] To: ${to} | Subject: ${subject} | Content: ${text}`);
      return true;
    }
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"DarziAtDoor" <notifications@darziatdoor.com>',
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });
    return true;
  } catch (error) {
    console.error("Failed to send notification email:", error.message);
    return false;
  }
};
