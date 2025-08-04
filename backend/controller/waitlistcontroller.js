const Waitlist = require('../model/waitlist');

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
    res.status(201).json(waitlistEntry);
  } catch (error) {
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
