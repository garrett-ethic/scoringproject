const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// @route   GET api/product
// @desc    Return all products from a specified category
// @access  Public
router.get('/', async (req, res) => {
  console.log("Get received");
  try {
    const { id } = req.body;
    let user = await User.findOne({ id });

    res.json(user.metrics);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/calulate
// @desc    add a new user to the db
// @access  Public
router.post('/', async (req, res) => {
  console.log(req.body);

  const { name, id, metrics } = req.body;

  try {
    let profile = await User.findOne({ id });

    if (profile) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already exists' }] });
    }

    profile = new User({
      name,
      id,
      metrics
    });
    await profile.save();

    res.send({
      message: 'Profile Posted',
      name: name,
      id: id,
      metrics: metrics
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
