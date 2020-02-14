const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Allows us to read and parse JSON objects
app.use(express.json());

const PORT = process.env.PORT || '8000';

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
