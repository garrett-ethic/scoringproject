const express = require('express');
const router = express.Router();
const Conditioner = require('../../models/Conditioner');
const FaceWash = require('../../models/Facewash');
const Lotion = require('../../models/Lotion');
const Shampoo = require('../../models/Shampoo');
const SkinCare = require('../../models/SkinCare');
const Sunscreen = require('../../models/Sunscreen');

// @route   GET api/product
// @desc    Return all products from a specified category
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.body;
    let products = await Shampoo.find();

    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/calulate
// @desc    add a new product to the db
// @access  Public
router.post('/', async (req, res) => {
  console.log(req.body);

  const { category, sku, name, brand, metrics } = req.body;

  try {
    //implement switch to determine product category
    let product = await Shampoo.findOne({ name });

    if (product) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Product already exists' }] });
    }

    product = new Shampoo({
      sku,
      name,
      brand,
      metrics
    });
    await product.save();

    res.send({
      message: 'Product Posted',
      sku: sku,
      name: name,
      brand: brand,
      metrics: metrics
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
