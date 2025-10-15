const Waitlist = require('../model/waitlist');
const sendEmail = require('../utils/sendEmail');

const joinWaitlist = async (req, res) => {
  const { role, email } = req.body;

  if (!role || !email) {
    return res.status(400).json({ message: 'Role and email are required' });
  }

  try {
    const existing = await Waitlist.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: 'Email already on the waitlist' });
    }

    const waitlistEntry = await Waitlist.create({ role, email });

    const subject = 'You’ve officially been drafted by SCAH';
    const html = `
      <h2>🎉 Welcome to the Hub! 🎉</h2>
      <p>You’ve joined SCAH as <strong>${role}</strong> — a vital part of our mission to shape the future of sports.</p>
      <p>We’re thrilled to welcome you to the Scout Connect Academy Hub (SCAH).</p>
      <p>Your presence signals a shared commitment to identifying and elevating talent.</p>
      <ul>
        <li>Early access to features and opportunities</li>
        <li>Exclusive updates on events and partnerships</li>
        <li>Insight into athlete development pipelines</li>
      </ul>
      <p>Thank you for believing in the vision and welcome to a new era of scouting and development.</p>
      <p>Sincerely,<br/>The SCAH Team</p>
    `;

    // Wrap email sending in try/catch to avoid crashing
    try {
      await sendEmail({
        to: email,
        subject,
        html,
        text: `You just joined the waitlist as a ${role}. We'll reach out soon.`,
      });
    } catch (emailErr) {
      console.error('Email failed:', emailErr);
      // Don't throw, just log
    }

    // Respond with success regardless of email
    res.status(201).json({ message: 'You have joined the waitlist successfully!', data: waitlistEntry });
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getWaitlist = async (req, res) => {
  try {
    const entries = await Waitlist.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { joinWaitlist, getWaitlist };
