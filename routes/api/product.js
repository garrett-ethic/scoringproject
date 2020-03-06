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

    let products;

    switch (category) {
      case 'Conditioner':
        products = await Conditioner.find();
        break;
      case 'FaceWash':
        products = await FaceWash.find();
        break;
      case 'Lotion':
        products = await Lotion.find();
        break;
      case 'Shampoo':
        products = await Shampoo.find();
        break;
      case 'SkinCare':
        products = await SkinCare.find();
        break;
      case 'SunScreen':
        products = await Sunscreen.find();
        break;
      default:
        return res
          .status(404)
          .json({ msg: 'Product Category not yet defined in Database' });
    }

    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/product
// @desc    add a new product to the db or update existing product
// @access  Public
router.post('/', async (req, res) => {
  console.log(req.body);

  const { category, sku, name, brand, metrics } = req.body;

  const productFields = {
    sku,
    name,
    brand,
    metrics
  };

  try {
    let collection;

    // Checks database if product already exists
    switch (category) {
      case 'Conditioner':
        productCat = Conditioner;
        break;
      case 'FaceWash':
        productCat = FaceWash;
        break;
      case 'Lotion':
        productCat = Lotion;
        break;
      case 'Shampoo':
        productCat = Shampoo;
        break;
      case 'SkinCare':
        productCat = SkinCare;
        break;
      case 'SunScreen':
        productCat = Sunscreen;
        break;
      default:
        return res
          .status(404)
          .json({ msg: 'Product Category not yet defined in Database' });
    }

    let product = await productCat.findOne({ sku: sku });

    // Update if exists
    if (product) {
      product = await productCat.findOneAndUpdate(
        { sku: sku },
        { $set: productFields },
        { new: true }
      );
      return res.json(product);
    }

    // Upload to database if it doesn't exist.
    product = new productCat(productFields);
    await product.save();

    res.json({
      message: 'New Product Posted',
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

// @route   GET api/product/:sku
// @desc    Return a product by SKU
// @access  Public
router.get('/:sku', async (req, res) => {
  try {
    let product;

    const { category } = req.body;

    switch (category) {
      case 'Conditioner':
        product = await Conditioner.findOne({ sku: req.params.sku });
        break;
      case 'FaceWash':
        product = await FaceWash.findOne({ sku: req.params.sku });
        break;
      case 'Lotion':
        product = await Lotion.findOne({ sku: req.params.sku });
        break;
      case 'Shampoo':
        product = await Shampoo.findOne({ sku: req.params.sku });
        break;
      case 'SkinCare':
        product = await SkinCare.findOne({ sku: req.params.sku });
        break;
      case 'SunScreen':
        product = await Sunscreen.findOne({ sku: req.params.sku });
        break;
      default:
        return res
          .status(404)
          .json({ msg: 'Product Category not yet defined in Database' });
    }

    if (!product) {
      return res.status(404).json({ msg: 'Shampoo not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
