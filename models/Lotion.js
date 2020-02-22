const mongoose = require('mongoose');

const LotionSchema = new mongoose.Schema({
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
      type: Number,
      default: 0
    },
    metric2: {
      type: Number,
      default: 0
    },
    metric3: {
      type: Number,
      default: 0
    }
  }
});

module.exports = Lotion = mongoose.model('lotion', LotionSchema);
