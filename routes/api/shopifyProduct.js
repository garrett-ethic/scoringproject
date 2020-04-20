const express = require('express');
const router = express.Router();
const axios = require('axios');
const ShopifyProduct = require('../../models/ShopifyProduct');
const dotenv = require('dotenv').config();

const shopifyAxios = axios.create({
  baseURL: 'https://ethic-marketplace.myshopify.com/admin/api/2020-01/products',
  auth: {
    username: process.env.SHOPIFY_STORE_USERNAME,
    password: process.env.SHOPIFY_STORE_PASSWORD,
  },
});

const setAuth = function (myURL) {
  myURL.username = process.env.SHOPIFY_STORE_USERNAME;
  myURL.password = process.env.SHOPIFY_STORE_PASSWORD;
  return myURL;
};

const getProduct = async function (id, baseURL) {
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
      tags,
    };
    console.log(productFields);
    /*await axios.get(productURL.toString()).then(res => {
      updateDatabase(res['data']['product']);
    });*/
  } catch (err) {
    console.error(err);
    return false;
  }
  return productFields;
};

const updateDatabase = async function (input_product) {
  const { id, title, vendor, product_type, tags } = input_product;

  const productFields = {
    id,
    title,
    vendor,
    product_type,
    tags,
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
};

const getTaggedProducts = async function (tag) {
  let products = [];
  //let tagList = [];
  let newURL =
    'https://ethic-marketplace.myshopify.com/admin/api/2020-01/products.json';
  while (newURL) {
    try {
      let res = await axios.get(newURL.toString() + '?limit=250', {
        params: {
          limit: 250,
        },
        auth: {
          username: process.env.SHOPIFY_STORE_USERNAME,
          password: process.env.SHOPIFY_STORE_PASSWORD,
        },
      });
      //console.log(`Status: ${res.status}`);
      let productsRaw = res.data['products'];
      for (index = 0; index < productsRaw.length; index++) {
        let productTags = productsRaw[index].tags.split(', ');
        if (tag === 'ineedtags') {
          let tagCounter;
          for (tagCounter = 0; tagCounter < productTags.length; ++tagCounter) {
            if (!products.includes(productTags[tagCounter])) {
              products.push(productTags[tagCounter]);
            }
          }
        } else {
          if (productTags.includes(tag)) {
            products.push(productsRaw[index]);
          }
        }
      }
      console.log(products);
      newURL = new URL(res.headers.link.slice(1, -13));
      newURL = await newURL;
    } catch (err) {
      console.error(err);
      newURL = false;
    }
  }
  return await products;
};

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

router.get('/tagList/:tag', async (req, res) => {
  try {
    let products = await getTaggedProducts(req.params.tag);

    if (products == null) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Products does not exist' }] });
    }

    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    let product = await getProduct(
      req.params.id,
      'https://ethic-marketplace.myshopify.com/admin/api/2020-01/products'
    );

    if (product == null) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Product does not exist' }] });
    }

    res.json(product);
    console.log(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/metrics/:id
// @desc    Creates a new metafield for the specified Shopify User. Don't use this route to update metafields.
// @access  Private
router.get('/metrics/:id', async (req, res) => {
  try {
    const productMetrics = await shopifyAxios.get(
      req.params.id + '/metafields.json'
    );
    res.json(productMetrics.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/metrics/:id
// @desc    Creates a new metafield for the specified Shopify User. Don't use this route to update metafields.
// @access  Private
router.put('/metrics/:id', async (req, res) => {
  try {
    const product = await shopifyAxios.put(req.params.id + '.json', req.body);
    res.json(product.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/metrics/:id
// @desc    Updates a single metafield for a specified product
// @access  Private
router.put('/metrics/:prodID/:metaID', async (req, res) => {
  try {
    const metafield = await shopifyAxios.put(
      req.params.prodID + '/metafields/' + req.params.metaID + '.json',
      req.body
    );
    res.json(metafield.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

/*
router.get('/:id', async (req, res) => {
  try {
    let product = await ShopifyProduct.findById(req.params.id);

    if (product == null) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Product does not exist' }] });
    }

    res.json(product);
    console.log(product);
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
*/
module.exports = router;
module.exports.getProduct = getProduct;
module.exports.getAllProducts = getTaggedProducts;
module.exports.updateDatabase = updateDatabase;
