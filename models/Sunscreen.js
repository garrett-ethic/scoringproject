const mongoose = require('mongoose');

const SunscreenSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  brand: {
    type: String,
    required: true
  },
  metrics: {
    metric1: {
      type: Number
    },
    metric2: {
      type: Number
    },
    metric3: {
      type: Number
    }
  }
});

module.exports = Sunscreen = mongoose.model('sunscreen', SunscreenSchema);
