const mongoose = require('mongoose');

const ShopifyUserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    }
});

module.exports = ShopifyUser = mongoose.model('shopifyUser', ShopifyUserSchema);