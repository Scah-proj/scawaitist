const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();


const allowedOrigins = [
  'http://localhost:3000',
  'https://scahnext.vercel.app',
  'https://scah.club',
  'http://scah.club',
  'https://www.scah.club', // ✅ Add this
  'http://www.scah.club',  // ✅ Add this
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));



app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use('/api/waitlist', require('./routes/waitlistRoutes'));

app.get('/', (req, res) => {
  res.send('Server is running!');
});



app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
