const mongoose = require('mongoose');

const SunscreenSchema = new mongoose.Schema({
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
        metric1: Number,
        metric2: Number,
        metric3: Number
    }
})

module.exports = Sunscreen = mongoose.model('sunscreen', SunscreenSchema); 