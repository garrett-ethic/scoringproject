const mongoose = require('mongoose');

const ShopifyProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body_html: {
    type: String
  },
  vendor: {
    type: String,
    required: true
  },
  product_type: {
    type: String,
  },
  tags: {
    type: String
  }
});

module.exports = Lotion = mongoose.model('shopifyproducts', ShopifyProductSchema);
