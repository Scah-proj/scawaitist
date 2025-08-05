require('dotenv').config();
const nodemailer = require('nodemailer');

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"SCAH" <' + process.env.SMTP_EMAIL + '>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Send email failed:', err);
    throw new Error('Error sending mail');
  }
};

module.exports = sendMail;
