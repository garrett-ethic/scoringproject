const express = require('express');
const router = express.Router();
const axios = require('axios');
const ShopifyProduct = require('../../models/ShopifyProduct');
const dotenv = require('dotenv').config();

const username = process.env.SHOPIFY_USERNAME;
const password = process.env.SHOPIFY_PASSWORD;

const baseURL =
  'https://ethic-marketplace.myshopify.com/admin/api/2020-01/products';

let newURL = new URL(baseURL + '.json');
let promises = [];
let products = [];

function setAuth(myURL) {
  myURL.username = username;
  myURL.password = password;
  return myURL;
}

async function getProductId(newURL) {
  try {
    const res = await axios.get(newURL.toString(), {}, {});
    console.log(`Status: ${res.status}`);
    const products_raw = res.data['products'];
    for (index = 0; index < products_raw.length; index++) {
      products.push(products_raw[index]['id']);
    }
    newURL = new URL(res.headers.link.slice(1, -13));
    console.log(newURL.toString());
    return await newURL;
  } catch (err) {
    return false;
  }
}

async function getProduct(id) {
  productURL = new URL(baseURL + '/' + id.toString() + '.json');
  productURL = setAuth(productURL);
  try {
    await axios.get(productURL.toString()).then(res => {
      updateDatabase(res['data']['product']);
    });
  } catch (err) {
    return false;
  }
}

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

async function updateDatabase(input_product) {
  const { id, title, vendor, product_type, tags } = input_product;

  const productFields = {
    id,
    title,
    vendor,
    product_type,
    tags
  };
  console.log(productFields);

  try {
    let product = await ShopifyProduct.findOne({ id: id });

    // Update if exists
    if (product) {
      product = await ShopifyProduct.findOneAndUpdate(
        { id: id },
        { $set: productFields },
        { new: true }
      );
      return product;
    }
    // Upload to database if it doesn't exist.
    product = new ShopifyProduct(productFields);
    await product.save();
  } catch (err) {
    console.error(err.message);
  }
}

async function getAllProducts() {
  while (newURL) {
    newURL = setAuth(newURL);
    await getProductId(newURL).then(res => {
      newURL = res;
    });
  }
  for (index = 0; index < products.length; index++) {
    // sleep for rate limiting
    await sleep(800);
    getProduct(products[index]);
  }
}

// getAllProducts();
/*
router.put('/:id', async (req, res) => {
  console.log(req.body);

  productURL = new URL(baseURL + '/' + req.params.id + '/metafields.json');
  productURL = setAuth(productURL);
  
  try {
    await axios.put(productURL.toString(), req.body);
  } catch (err) {
    console.error(err);
  }	
});
*/

// -------------- Start of HTTP request methods -----------------

// @route   GET api/shopifyProduct/
// @desc    Return a Shopify product from local database
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    let product = await ShopifyProduct.findById(req.params.id);

    if (product == null) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Product does not exist' }] });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/shopifyProduct/
// @desc    Updates a Shopify product from local database
// @access  Public
router.put('/:id', async (req, res) => {
  console.log(req.body);

  // const { metrics } = req.body;

  // const metricFields = {};
  // if (req.)

  try {
    product = await ShopifyProduct.findOneAndUpdate(
      { _id: req.params.id },
      { metrics: req.body.metrics },
      { new: true }
    );

    if (product == null) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Product does not exist' }] });
    }

    return res.json(product);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;

