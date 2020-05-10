const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config();
const cors = require('cors');

const db =
  'mongodb+srv://ethicscore-lvey1.mongodb.net/test?retryWrites=true&w=majority';

const app = express();

app.use(cors());

// Allows us to read and parse JSON objects
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit();
  }
};

connectDB();

const PORT = process.env.PORT || '5000';

// Define Routes
app.use('/api/calculate', require('./routes/api/calculate'));
app.use('/api/metricDetails', require('./routes/api/metricDetails'));
app.use('/api/product', require('./routes/api/product'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/shopifyProduct', require('./routes/api/shopifyProduct'));
app.use('/api/shopifyUser', require('./routes/api/shopifyUser'));

// Serve HTML file for Mock User interface. Viewd at http://localhost:5000
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Serves static files for mock user interface
app.use(express.static('public'));

var server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

server.timeout = 600000;
