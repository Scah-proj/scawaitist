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
  
  <p>Hey ,</p>

  <p>With the #1 pick in the Scouting Draft of the Year… we choose <strong>YOU</strong>!</p>

  <p>As the official Commissioner of SCAH, we’re proud to announce your draft into our elite insider circle.</p>

  <p>No trade clause. No combine needed. Just good vibes, big dreams, and a shared love for discovering greatness.</p>

  <p>We noticed your early interest in this bold vision we’re building—thank you! You’re now part of a special group getting sneak peeks, private updates, and maybe even a few top-secret scouting rumors (all legally SEC-compliant… we promise 😉).</p>

  <p>We'll keep you in the loop as we gear up for launch—and you’ll be among the first to know when it's go-time.</p>

  <p>Until then, stretch those legs, shine your cleats, and get ready. The future of scouting starts now—and it starts with you.</p>

  <p>Welcome to the team.</p>

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
