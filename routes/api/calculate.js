const express = require('express');
const router = express.Router();

// @route   GET api/calulate
// @desc    Return Graded user preferences when given an input form
// @access  Public
router.get('/', (req, res) => {
  try {
    // res.json({ msg: 'Test request Works!' });

    const { envInput, socialInput } = req.body;

    inputs = {
      envInput,
      socialInput
    };

    scores = {
      envScore: 'A',
      socialScore: 'B'
    };

    res.json(scores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
