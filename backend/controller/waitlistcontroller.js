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

  <p>You’ve officially joined SCAH as <strong>${role}</strong> — a vital part of our mission to shape the future of sports.</p>

  <p>We’re thrilled to welcome you to the Scout Connect Academy Hub (SCAH), a community built for those shaping the future of sports.</p>

  <p>Your presence here signals a shared commitment to identifying and elevating talent, providing opportunities, and making meaningful connections across the sporting world.</p>

  <p>As part of our founding inner circle, you'll receive:</p>
  <ul>
    <li>Early access to platform features and opportunities,</li>
    <li>Exclusive updates on upcoming events, showcases, and partnerships,</li>
    <li>And insight into athlete development pipelines and verified talent.</li>
  </ul>

  <p>We believe in building a trusted network, where athletes can shine and scouts can recruit with confidence. No noise, just value.</p>

  <p>You’ll be among the first to know when it’s go-time. Until then, thank you for believing in the vision and welcome to a new era of scouting and development.</p>

  <p>Let’s get to work.</p>

  <p>Sincerely,<br/>The SCAH Team</p>
`;


    
    await sendEmail({
      to: email,
      subject,
      html,
      text: `You just joined the waitlist as a ${role}. We'll reach out soon.`,
    });

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
