const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['Athlete', 'Scout']
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Waitlist', waitlistSchema);
