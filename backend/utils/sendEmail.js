require('dotenv').config();
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const surveyLink = process.env.SURVEY_LINK;

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

    await resend.emails.send({
      from: `SCAH <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html: fullHtml,
      text: `${text || ''}\n\nTake the survey here: ${surveyLink}`,
    });

    console.log('✅ Email sent via Resend');
    return true;

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error('EMAIL_FAILED');
  }
};

module.exports = sendMail;
