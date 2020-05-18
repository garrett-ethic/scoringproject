const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv').config();

const shopifyAxios = axios.create({
  baseURL: 'https://ethic-marketplace.myshopify.com/admin/api/2020-04/products',
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    //console.log(productFields);
    /*await axios.get(productURL.toString()).then(res => {
      updateDatabase(res['data']['product']);
    });*/
  } catch (err) {
    console.error(err);
    return false;
  }
  return productFields;
};

const getProductMetafields = async function (id, baseURL) {
  try {
    productURL = new URL(baseURL + '/' + id.toString() + '/metafields.json');
    productURL = setAuth(productURL);
    metafields = await axios.get(productURL.toString());
    metafields = metafields['data']['metafields'];
  } catch (err) {
    console.error(err);
    return false;
  }
  return metafields;
};

function isSuperset(set, subset) {
  for (let elem of subset) {
    if (!set.includes(elem)) {
      return false;
    }
  }
  return true;
}

function hasCommon(list, other) {
  for (let elem of list) {
    for (let inner of other) {
      if (elem === inner) {
        return true;
      }
    }
  }
  return false;
}

const getAllProducts = async function () {
  let tags = [];
  let vendors = [];
  let allProducts = [];
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
      let productsRaw = res.data['products'];
      for (index = 0; index < productsRaw.length; index++) {
        let productTags = productsRaw[index].tags.split(', ');
        // we are returning the list of valid tags
        let tagCounter;
        for (tagCounter = 0; tagCounter < productTags.length; ++tagCounter) {
          if (!tags.includes(productTags[tagCounter])) {
            tags.push(productTags[tagCounter]);
          }
        }
        if (!vendors.includes(productsRaw[index].vendor)) {
          vendors.push(productsRaw[index].vendor);
        }

        allProducts.push(productsRaw[index]);
      }
      newURL = new URL(res.headers.link.slice(1, -13));
      newURL = await newURL;
    } catch (err) {
      console.error(err);
      newURL = false;
    }
  }
  let res = {
    products: allProducts,
    tags: tags,
    vendors: vendors,
  };
  return await res;
};

const getNewProducts = async function () {
  let products = [];

  console.log('Searching for new products ...');

  let newURL =
    'https://ethic-marketplace.myshopify.com/admin/api/2020-01/products.json';
  //while (newURL) {
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

    let productsRaw = res.data['products'];
    let i;

    for (i = 0; i < productsRaw.length; ++i) {
      metafield = await getProductMetafields(
        productsRaw[i].id,
        'https://ethic-marketplace.myshopify.com/admin/api/2020-01/products'
      );
      await sleep(550);

      if (metafield.length == 0) {
        products.push(
          await getProduct(
            productsRaw[i].id,
            'https://ethic-marketplace.myshopify.com/admin/api/2020-01/products'
          )
        );
        await sleep(550);
      } else {
        let metricExists = false;
        let j;
        for (j = 0; j < metafield.length; ++j) {
          if (
            'metric1' in metafield[j] ||
            'metric2' in metafield[j] ||
            'metric3' in metafield[j]
          ) {
            metricExists = true;
          }
        }
        if (!metricExists) {
          products.push(
            await getProduct(
              productsRaw[i].id,
              'https://ethic-marketplace.myshopify.com/admin/api/2020-01/products'
            )
          );
          await sleep(550);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  //}

  console.log(products);
  return products;
};

// -------------- Start of HTTP request methods -----------------

router.post('/allProducts', async (req, res) => {
  try {
    let results = await getAllProducts();
    console.log(results);
    if (results == null) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Products do not exist' }] });
    }

    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/shopifyProduct/updateProducts
// @desc    Bulk editing product metrics of multiple products
// @access  Public
router.post('/updateProducts', async (req, res) => {
  const body = req.body;
  const idList = body['idList'];
  let metafieldMap = {
    an_ri: body['an_ri'],
    co_im: body['co_im'],
    eco_f: body['eco_f'],
    labor: body['labor'],
    all_n: body['all_n'],
  };

  console.log(idList);
  // if the value is the default, which is leave alone
  // then do not update the metric.
  for (let categoryKey in metafieldMap) {
    let category = metafieldMap[categoryKey];
    for (let metricKey in category) {
      if (category[metricKey] === '') {
        delete category[metricKey];
      }
    }
    if (Object.keys(category).length === 0) {
      delete metafieldMap[categoryKey];
    }
  }
  console.log(metafieldMap);
  for (let pid of idList) {
    try {
      const data = await shopifyAxios.get(pid + '/metafields.json');
      let existingMetrics = data.metafields;
      if (existingMetrics === undefined) {
        // no metafields exist yet
        for (let newCategoryKey in metafieldMap) {
          sleep(550);
          let res = await shopifyAxios.post(pid + '/metafields.json', {
            metafield: {
              key: newCategoryKey,
              value: JSON.stringify(metafieldMap[newCategoryKey]),
              value_type: 'string',
              namespace: 'ethic-metric',
            },
          });
        }
      } else {
        for (let existingCategory of existingMetrics) {
          sleep(550);
          if (existingCategory.key in metafieldMap) {
            // update existing metafield
            let existingCategoryDict = JSON.parse(existingCategory.value);
            let new_dict = metafieldMap[existingCategory.key];
            for (let key of new_dict) {
              existingCategoryDict[key] = new_dict[key];
            }
            let res = await shopifyAxios.put(
              pid + '/metafields/' + category.id + '.json',
              {
                metafield: {
                  id: existingCategory.id,
                  value: JSON.stringify(existingCategoryDict),
                  value_type: 'string',
                },
              }
            );
          } else {
            // one or more metafields is missing
            let res = await shopifyAxios.post(pid + '/metafields.json', {
              metafield: {
                key: existingCategory.key,
                value: JSON.stringify(metafieldMap[existingCategory.key]),
                value_type: 'string',
                namespace: 'ethic-metric',
              },
            });
          }
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  res.json('product update successful!');
  /*} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }*/
});

router.get('/newProducts', async (req, res) => {
  try {
    let products = await getNewProducts();

    if (products == null) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'No new products exist' }] });
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

// @route   GET api/shopifyProduct/metrics/:id
// @desc    Retrieves all metafields for the specified Shopify Product.
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

// @route   PUT api/shopifyProduct/metrics/:id
// @desc    Creates a new metafield for the specified Shopify Product. Don't use this route to update metafields.
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

// @route   PUT api/shopifyProduct/metrics/:id
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

module.exports = router;
module.exports.getProduct = getProduct;
