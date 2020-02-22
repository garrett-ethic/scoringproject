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

	let product = await Shampoo.find({"sku": sku});
	let user = await User.find({"id": userID});
	
	if (!product) {
		return res.status(404).json({msg: 'Product not found'});
	}
	
	if (!user) {
		return res.status(404).json({msg: 'User not found'});
	}
	
	userMetrics = user[0].metrics;
	productMetrics = product[0].metrics;
	
	score = productMetrics.metric1 * userMetrics.reuse + productMetrics.metric2 * userMetrics.env + productMetrics.metric3 * userMetrics.social;

    res.json(score);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
