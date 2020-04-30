const express = require("express");
const router = express.Router();
const axios = require("axios");
const ShopifyUser = require("../../models/ShopifyUser");

const shopifyAxios = axios.create({
  baseURL:
    "https://ethic-marketplace.myshopify.com/admin/api/2020-01/customers/",
  auth: {
    username: process.env.SHOPIFY_STORE_USERNAME,
    password: process.env.SHOPIFY_STORE_PASSWORD,
  },
});

router.get("/:id", async (req, res) => {
  try {
    const user = await shopifyAxios.get(req.params.id + ".json");

    // user isnt null if its not there, look up how to handle this properly
    // (besides giving a 404)
    // if (user == null) {
    //     return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
    // }

    console.log(user.data["customer"]);
    res.json(user.data["customer"]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", async (req, res) => {
  // console.log(req.body);

  try {
    const user = await shopifyAxios.put(req.params.id + ".json", req.body);
    // console.log(user);
    res.json(user.data["customer"]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// get customer metafields by ID
router.get("/preferences/:id", async (req, res) => {
  try {
    const userMetafields = await shopifyAxios.get(
      req.params.id + "/metafields.json"
    );
    res.json(userMetafields.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/preferences/:id
// @desc    Creates a new metafield for the specified Shopify User. Don't use this route to update metafields.
// @access  Private
router.put("/preferences/:id", async (req, res) => {
  try {
    const userMetafields = await shopifyAxios.put(
      req.params.id + ".json",
      req.body
    );
    res.json(userMetafields.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/preferences/:custID/:metaID
// @desc    Updates a single metafield for a specified user
// @access  Private
router.put("/preferences/:userID/:metaID", async (req, res) => {
  try {
    const metafield = await shopifyAxios.put(
      req.params.userID + "/metafields/" + req.params.metaID + ".json",
      req.body
    );
    res.json(metafield.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
