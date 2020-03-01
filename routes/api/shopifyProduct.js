const express = require('express');
const router = express.Router();
const axios = require('axios');
const url = require('url');

const dotenv = require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

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
    const res = await axios.get(anewURL.toString(), {}, {});
    console.log(`Status: ${res.status}`);
    const products_raw = res.data['products'];
    for (index = 0; index < products_raw.length; index++) {
      products.push(products_raw[index]['id']);
    }
    newURL = new URL(res.headers.link.slice(1, -13));
    console.log(newURL.toString());
    return await newURL;
  } catch (err) {
    return '';
  }
}

async function getProduct(id) {
  productURL = new URL(baseURL + '/' + id.toString() + '.json');
  productURL = setAuth(productURL);
  try {
    await axios.get(productURL.toString()).then(res => {
      console.log(res);
    });
  } catch (err) {
    console.error(err);
  }
}

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

async function getAllProducts() {
  while (newURL) {
    newURL = setAuth(newURL);
    await getProductId(newURL).then(res => {
      newURL = res;
    });
  }
  console.log(products);

  for (index = 0; index < products.length; index++) {
    await sleep(800);
    getProduct(products[index]);
  }
}

getAllProducts();

module.exports = router;
