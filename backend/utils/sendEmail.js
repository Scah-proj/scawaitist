require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const fullHtml = `
      ${html || ''}
      <br/><br/>
      <p style="font-size:12px; color:#666;">This message was sent by SCAH Support.</p>
    `;

    const data = await resend.emails.send({
      from: 'SCAH <onboarding@resend.dev>',

      to,
      subject,
      text,
      html: fullHtml,
    });

    console.log('✅ Email sent successfully via Resend:', data);
    return true;
  } catch (err) {
    console.error('❌ Email sending failed via Resend:', err.message);
    console.error('📄 Full error:', err.response?.body || err);
    throw new Error('EMAIL_FAILED');
  }
};

module.exports = sendMail;
