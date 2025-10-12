require('dotenv').config();
const nodemailer = require('nodemailer');

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const surveyLink = process.env.SURVEY_LINK;

    const fullHtml = `
      ${html || ''}
      <br/><br/>
      <p><b>We’d love your feedback!</b></p>
      <p>Please take a moment to fill out our quick survey:</p>
      <a href="${surveyLink}" target="_blank" style="display:inline-block; background:#007bff; color:#fff; padding:10px 18px; border-radius:6px; text-decoration:none;">
        Take Survey
      </a>
    `;

    const mailOptions = {
      from: `"SCAH" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text: `${text || ''}\n\nTake the survey here: ${surveyLink}`,
      html: fullHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Send email failed:', err);
    throw new Error('Error sending mail');
  }
};

module.exports = sendMail;
