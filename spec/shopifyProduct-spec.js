const express = require('express');
const router = express.Router();
const axios = require('axios');
const ShopifyProduct = require('../models/ShopifyProduct');
const dotenv = require('dotenv').config();
const Jasmine = require('jasmine');
const srcFile = require('../routes/api/shopifyProduct.js');


// Run these tests with jasmine-node shopifyProduct-spec.js

// UNIT TESTS
describe('unit tests', () => {
  const baseURL =
    'https://ethic-marketplace.myshopify.com/admin/api/2020-01/products';

  let originalTimeout;
  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  it('returns all the products given a valid url', async() => {
    products = await srcFile.getAllProducts(baseURL);
    // Thinking about rewriting this test because it's possible
    // to have 0 products.
    expect(products.length).toBeGreaterThan(0);
  });

  it('returns nothing given an invalid url', async() => {
    products = await srcFile.getAllProducts('invalidURL.com');
    expect(products.length).toBe(0);
  });

  it('returns the correct product', async() => {
    res = await srcFile.getProduct("4340968915009", baseURL);
    console.log(res);
    expect(res.status).toBe(200);
  });

  it('returns false when given a invalid prouduct id', async() => {
    res = await srcFile.getProduct('bogusid', baseURL);
    expect(res).toBe(false);
  });
  
  it('returns false when given a invalid proudct url', async() => {
    res = await srcFile.getProduct('', 'invalidURL.com');
    expect(res).toBe(false);
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
