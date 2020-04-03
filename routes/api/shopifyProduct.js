const express = require('express');
const router = express.Router();
const axios = require('axios');
const ShopifyProduct = require('../../models/ShopifyProduct');
const dotenv = require('dotenv').config();

const setAuth = function(myURL) {
  myURL.username = process.env.SHOPIFY_USERNAME;
  myURL.password = process.env.SHOPIFY_PASSWORD;
  return myURL;
}

const getProduct = async function(id, baseURL) {
  try {
    productURL = new URL(baseURL + '/' + id.toString() + '.json');
    productURL = setAuth(productURL);
    product = await axios.get(productURL.toString());
    const { title, vendor, product_type, tags } = product['data']['product'];
    productFields = {
        id,
        title,
        vendor,
        product_type,
        tags
    };
    console.log(productFields);
    /*await axios.get(productURL.toString()).then(res => {
      updateDatabase(res['data']['product']);
    });*/
  } catch (err) {
    console.error(err);
    return false;
  }
  return product;
}

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const updateDatabase = async function(input_product) {
  const { id, title, vendor, product_type, tags } = input_product;

  const productFields = {
    id,
    title,
    vendor,
    product_type,
    tags
  };

  try {
    let product = await ShopifyProduct.findOne({ id: id.toString() });

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
  return product;
}

const getAllProducts = async function(baseURL) {
  let products = [];
  let newURL;
  try {
    newURL = new URL(baseURL + '.json');
  } catch (err) {
    return products;
  }
  newURL = setAuth(newURL);
  while (newURL) {
    newURL = setAuth(newURL);
    try {
      const res = await axios.get(newURL.toString(), {}, {});
      //console.log(`Status: ${res.status}`);
      const products_raw = res.data['products'];
      for (index = 0; index < products_raw.length; index++) {
        products.push(products_raw[index]['id']);
      }
      newURL = new URL(res.headers.link.slice(1, -13));
      newURL = await newURL;
    } catch (err) {
      //console.error(err);
      newURL = false;
    }
  }

  const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  for (index = 0; index < products.length; index++) {
    // sleep for rate limiting
    await sleep(800);
    getProduct(products[index], baseURL);
  }
  return products
}

//getAllProducts('https://ethic-marketplace.myshopify.com/admin/api/2020-01/products');

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
module.exports.getProduct = getProduct;
module.exports.getAllProducts = getAllProducts;
module.exports.updateDatabase = updateDatabase;




