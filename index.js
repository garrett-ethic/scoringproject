const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();

// Middleware that enables CORS
app.use(cors());

// Allows us to read and parse JSON objects
app.use(express.json());

const PORT = process.env.PORT || '5000';

// Define Routes
app.use('/api/calculate', require('./routes/api/calculate'));
app.use('/api/metricDetails', require('./routes/api/metricDetails'));
app.use('/api/shopifyProduct', require('./routes/api/shopifyProduct'));
app.use('/api/shopifyUser', require('./routes/api/shopifyUser'));

var server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

server.timeout = 600000;
