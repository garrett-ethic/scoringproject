const mongoose = require('mongoose');

const FaceWashSchema = new mongoose.Schema({
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

module.exports = FaceWash = mongoose.model('faceWash', FaceWashSchema); 