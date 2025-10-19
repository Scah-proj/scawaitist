require('dotenv').config();
const nodemailer = require('nodemailer');

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const surveyLink =
      process.env.SURVEY_LINK ||
      'https://docs.google.com/forms/d/1soUw5M40c_qX8LnKh5gHVH_VxS46Nl2XfN1itvKfKjA/viewform';

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false, // TLS will be used if available
      requireTLS: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // ✅ Fixed: remove misplaced backticks around the link and improve styling
    const fullHtml = `
      ${html || ''}
      <br/><br/>
      <p><b>We’d love your feedback!</b></p>
      <p>Please take a moment to fill out our quick survey:</p>
      <a href="${surveyLink}" target="_blank"
        style="display:inline-block; background:#007bff; color:#fff; padding:10px 18px;
        border-radius:6px; text-decoration:none;">
        Take Survey
      </a>
      <br/><br/>
      <p style="font-size:12px; color:#666;">This message was sent by SCAH Support.</p>
    `;

    const mailOptions = {
      from: `"SCAH" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text: `${text || ''}\n\nTake the survey here: ${surveyLink}`,
      html: fullHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
    return true;
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    throw new Error('EMAIL_FAILED');
  }
};

module.exports = sendMail;
