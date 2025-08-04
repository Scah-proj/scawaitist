const Waitlist = require('../model/waitlist');
const sendEmail = require('../utils/sendEmail'); // <-- Import the util

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

    // 📧 Send confirmation email
    const subject = 'You have joined the waitlist!';
    const html = `
      <h2>Welcome to SCAH Waitlist</h2>
      <p>Hi there! You just joined the waitlist as a <strong>${role}</strong>.</p>
      <p>We'll reach out to you as soon as we're live!</p>
    `;

    await sendEmail(email, subject, html);

    res.status(201).json(waitlistEntry);
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
