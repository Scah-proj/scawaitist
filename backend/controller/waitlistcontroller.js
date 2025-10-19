const Waitlist = require('../model/waitlist');
const sendEmail = require('../utils/sendEmail');

const joinWaitlist = async (req, res, next) => {
  try {
    const { role, email } = req.body;

    // Validate input
    if (!role || !email) {
      res.status(400);
      throw new Error('Role and email are required');
    }

    // Check if already exists
    const existing = await Waitlist.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error('Email already on the waitlist');
    }

    // Create new record
    const waitlistEntry = await Waitlist.create({ role, email });

    // Email details
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
      <p>Sincerely,<br/>The SCAH Team</p>
    `;

    // Try sending email
    const mailSent = await sendEmail({
      to: email,
      subject,
      html,
      text: `You just joined the waitlist as a ${role}. We'll reach out soon.`,
    });

    // Log result for Railway visibility
    console.log('📨 sendEmail result:', mailSent);

    // Continue even if email failed
    res.status(201).json({
      success: true,
      message: 'Joined waitlist successfully',
      emailSent: mailSent,
      data: waitlistEntry,
    });
  } catch (err) {
    console.error('❌ Waitlist error:', err.message || err);
    next(err); // ✅ Pass error to your global error handler
  }
};

// GET all waitlist entries
const getWaitlist = async (req, res, next) => {
  try {
    const entries = await Waitlist.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error('❌ Get waitlist error:', err.message || err);
    next(err); // ✅ Send to errorHandler middleware
  }
};

module.exports = { joinWaitlist, getWaitlist };
