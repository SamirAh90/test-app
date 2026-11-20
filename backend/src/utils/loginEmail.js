const nodemailer = require("nodemailer");

function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.MAIL_FROM && process.env.FRONTEND_URL);
}

async function sendLoginEmail(email, link) {
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  const result = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Din inloggningslänk till MedborgaTest",
    text: `Logga in på MedborgaTest genom att öppna länken och trycka på Logga in:\n\n${link}\n\nLänken gäller i 15 minuter och kan bara användas en gång.\nOm du inte begärde länken kan du ignorera detta mejl. Dela inte länken med någon.`,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  if (!result.accepted?.length) throw new Error("Message not accepted");
}

module.exports = { emailConfigured, sendLoginEmail };
