// PRJ-A65E-0046: Email service configuration
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  // Agar Gmail credentials .env mein nahi hain → simulate (console log)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 [SIMULATED EMAIL]');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${text}`);
    return { simulated: true };
  }
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    console.log(`📧 Email sent to ${to}`);
    return { sent: true };
  } catch (err) {
    console.log('📧 Email failed:', err.message);
    return { error: err.message };
  }
};

module.exports = { sendEmail };