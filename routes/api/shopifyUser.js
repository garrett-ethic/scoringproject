const express = require('express');
const router = express.Router();
const axios = require('axios');

const shopifyAxios = axios.create({
  baseURL:
    'https://ethic-marketplace.myshopify.com/admin/api/2020-01/customers/',
  auth: {
    username: process.env.SHOPIFY_STORE_USERNAME,
    password: process.env.SHOPIFY_STORE_PASSWORD,
  },
});

// @route   GET api/shopifyUser/:id
// @desc    Retrieves customer information given a shopify user id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await shopifyAxios.get(req.params.id + '.json');

    // user isnt null if its not there, look up how to handle this properly
    // (besides giving a 404)
    // if (user == null) {
    //     return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
    // }

    console.log(user.data['customer']);
    res.json(user.data['customer']);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/shopifyUser/preferences/:id
// @desc    Retrieves all existing metafields for a specified user
// @access  Public
router.get('/preferences/:id', async (req, res) => {
  try {
    const userMetafields = await shopifyAxios.get(
      req.params.id + '/metafields.json'
    );
    res.json(userMetafields.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/shopifyUser/preferences/:id
// @desc    Creates a new metafield for the specified Shopify User. Don't use this route to update metafields.
// @access  Public
router.put('/preferences/:id', async (req, res) => {
  try {
    const userMetafields = await shopifyAxios.put(
      req.params.id + '.json',
      req.body
    );
    res.json(userMetafields.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/shopifyUser/preferences/:custID/:metaID
// @desc    Updates a single metafield for a specified user
// @access  Public
router.put('/preferences/:userID/:metaID', async (req, res) => {
  try {
    const metafield = await shopifyAxios.put(
      req.params.userID + '/metafields/' + req.params.metaID + '.json',
      req.body
    );
    res.json(metafield.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
