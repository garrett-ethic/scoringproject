const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Shampoo = require('../../models/Shampoo');
const ShopifyProduct = require('../../models/ShopifyProduct');

// EVENTUALLY, replace user with actual user

// @route   GET api/calulate
// @desc    Return calculated ethic score given shopify product and userID
// @access  Public
router.get('/shopify/:userID/:productID', async (req, res) => {
  try {
    const { userID, productID } = req.params;

    let user = await User.findById(userID);

    let product = await ShopifyProduct.findById(productID);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // assume that every product has a metric when initialized
    userMetrics = user.metrics;
    productMetrics = product.metrics;

    if (!userMetrics) {
      return res.status(404).json({ msg: 'User Metrics not found' });
    }

    let score =
      productMetrics.bcorp * userMetrics.reuse +
      productMetrics.env * userMetrics.env +
      productMetrics.social * userMetrics.social;
    // if score is 0, user does not have any metrics (assume for now)
    if (score === 0) {
      score = productMetrics.reuse + productMetrics.env + productMetrics.social;
    }
    res.json({ score: score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/calulate
// @desc    Return default ethic score
// @access  Public
router.get('/shopify/:productID', async (req, res) => {
  try {
    const { productID } = req.params;

    let product = await ShopifyProduct.findById(productID);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // assume that every product has a metric when initialized
    let productMetrics = product.metrics;

    let score =
      productMetrics.bcorp * 5 +
      productMetrics.env * 5 +
      productMetrics.social * 5;

    res.json({ score: score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/calulate
// @desc    Return calculated ethic score when given userID and product FROM Temporary models
// @access  Public
router.get('/:userID/:category/:sku', async (req, res) => {
  try {
    let product;
    const { category, sku, userID } = req.params;

    switch (category) {
      case 'Conditioner':
        product = await Conditioner.findOne({ sku });
        break;
      case 'FaceWash':
        product = await FaceWash.findOne({ sku });
        break;
      case 'Lotion':
        product = await Lotion.findOne({ sku });
        break;
      case 'Shampoo':
        product = await Shampoo.findOne({ sku });
        break;
      case 'SkinCare':
        product = await SkinCare.findOne({ sku });
        break;
      case 'SunScreen':
        product = await Sunscreen.findOne({ sku });
        break;
      default:
        return res
          .status(404)
          .json({ msg: 'Product Category not yet defined in Database' });
    }

    if (!product) {
      return res.status(404).json({ msg: 'Shampoo not found' });
    }

    let user = await User.findById(userID);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // assume that every product has a metric when initialized
    userMetrics = user.metrics;
    productMetrics = product.metrics;

    //not needed because if the user has not submitted their prefs, score will default to 0
    // if (!userMetrics) {
    // 	return res.status(404).json({msg: 'User Metrics not found'});
    // }

    score =
      productMetrics.metric1 * userMetrics.reuse +
      productMetrics.metric2 * userMetrics.env +
      productMetrics.metric3 * userMetrics.social;
    // if score is 0, user does not have any metrics (assume for now)
    if (score === 0) {
      score =
        productMetrics.metric1 +
        productMetrics.metric2 +
        productMetrics.metric3;
    }
    res.json({ score: score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
