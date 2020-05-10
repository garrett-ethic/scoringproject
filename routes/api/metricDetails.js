const express = require('express');
const router = express.Router();

const fs = require('fs');

router.get('/:category', async (req, res) => {
  try {
    fs.readFile(
      'metric-weights/' + req.params.category + '.json',
      'utf8',
      (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(data);
        res.json(JSON.parse(data));
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:category', async (req, res) => {
  try {
    fs.writeFile(
      'metric-weights/' + req.params.category + '.json',
      JSON.stringify(req.body),
      (err) => {
        if (err) throw err;
        console.log('Updated Community Impact Metrics!'); // Success!
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
