const express = require('express');
const mongoose = require('mongoose');

const db = "mongodb+srv://ethicScore_dev:ethicScore_dev@ethicscore-lvey1.mongodb.net/test?retryWrites=true&w=majority"
const app = express();

// Allows us to read and parse JSON objects
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected...');

  } catch (err) {
    console.error(err.message);
    process.exit();
  }
}
connectDB();

const PORT = process.env.PORT || '5000';

// Define Routes
app.use('/api/calculate', require('./routes/api/calculate'));
app.use('/api/product', require('./routes/api/product'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/shopifyProduct', require('./routes/api/shopifyProduct'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

