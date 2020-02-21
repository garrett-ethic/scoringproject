const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  metrics: {
    reuse: {
      type: Number,
      default: 0
    },
    env: {
      type: Number,
      default: 0
    },
    social: {
      type: Number,
      default: 0
    }
  },
  
});

module.exports = User = mongoose.model('user', UserSchema);
