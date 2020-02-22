const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Shampoo = require('../../models/Shampoo');

// @route   GET api/calulate
// @desc    Return Graded user preferences when given an input form
// @access  Public
router.get('/', async (req, res) => {
  try {
    // res.json({ msg: 'Test request Works!' });

    const { sku, userID } = req.body;

	let product = await Shampoo.findOne({"sku": sku});
	let user = await User.findOne({"id": userID});
	
	if (!product) {
		return res.status(404).json({msg: 'Product not found'});
	}
	if (!user) {
		return res.status(404).json({msg: 'User not found'});
	}
	
	// assume that every product has a metric when initialized
	userMetrics = user.metrics;
	productMetrics = product.metrics;
	
	//not needed because if the user has not submitted their prefs, score will default to 0
	// if (!userMetrics) {
	// 	return res.status(404).json({msg: 'User Metrics not found'});
	// }
	
	score = productMetrics.metric1 * userMetrics.reuse + productMetrics.metric2 * userMetrics.env + productMetrics.metric3 * userMetrics.social;
	// if score is 0, user does not have any metrics (assume for now)
	if (score === 0) {
		score = productMetrics.metric1 + productMetrics.metric2 + productMetrics.metric3;
	}
    res.json(score);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
