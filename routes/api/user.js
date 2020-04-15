const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// @route   GET api/user
// @desc    Return a specified user
// @access  Public
router.get('/:id', async (req, res) => {
  // console.log("Get received");
  try {
    let user = await User.findById(req.params.id);

    if (user == null) {
      return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/user
// @desc    add a new user to the db
// @access  Public
router.post('/', async (req, res) => {
  console.log(req.body);

  const { name, metrics } = req.body;

  try {
    // change the findOne param to email or something more unique
    let user = await User.findOne({ name });

    // if (user) {
    //   return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    // }

    if (user) {
      user = await User.findOneAndUpdate(
        { name: name },
        { metrics: metrics },
        { new: true }
      );
      return res.json(user);
    }

    user = new User({
      name,
      metrics
    });
    await user.save();

    res.send({
      message: 'Profile Posted',
      name: name,
      metrics: metrics
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
