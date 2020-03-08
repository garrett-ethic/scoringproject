const Jasmine = require('jasmine');
const testFile = require('../routes/api/shopifyProduct.js');
/*
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
    console.error('url for get product ids invalid'); 
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
    return true;
  } catch (err) {
    console.error('product id is invalid');
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
    await sleep(800);
    getProduct(products[index]);
  }
}
*/
// UNIT TESTS
describe('unit tests', () => {

  let originalTimeout;
  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it('returns false when given a invalid url', async() => {
    url = await testFile.getProductId('bogusurl');
    expect(url).toBe(false);
  });

  it('returns the correct product', async() => {
    myURL = testFile.setAuth(testFile.newURL);
    myURL = await testFile.getProductId(myURL);
    console.log(myURL);
    expect(myURL['href']).toBeTruthy();
  });

  it('returns false when given a invalid proudct id', async() => {
    res = await testFile.getProduct('bogusid');
    expect(res).toBe(false);
  });
  
  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
})

//getAllProducts();



