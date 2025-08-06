const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'http://scah.club', 'https://scah.club'],
  methods: ['GET', 'POST'],
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
