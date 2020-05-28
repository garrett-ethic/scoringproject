const express = require("express");
const router = express.Router();
const axios = require("axios");
//const metricweights = require('../../metric-weights.json');

// EVENTUALLY, replace user with actual user
// need to make this line up with the real files
const metricweights = {
  co_im: {
    USA_made: 2,
    employs_locally: 2,
    community_activism: 2,
    business_size: 2,
    donates_locally: 2,
    one_percent_for_the_planet: 2,
    political_donations: 2,
    donate_to_oppressed: 2,
    bcorp: 2,
    local_zip: 2,
  },
  eco_f: {
    sustainable_packaging: 2,
    sustainable_materials: 2,
    zeroCarbon_shipping: 2,
    zeroCarbon_manufacturing: 2,
    manufacturing_impact: 2,
    fsc: 2,
    rainforest_alliance: 2,
    cradle_to_cradle: 2,
    donate_to_environment: 2,
    bcorp: 2,
  },
  all_n: {
    certified_organic: 2.2222,
    organic_practices: 2.2222,
    allNatural_ingredients: 2.2222,
    reef_safe: 2.2222,
    ewg: 2.2222,
    madeSafe: 2.2222,
    consumerLabs: 2.2222,
    transparency: 2.2222,
    bcorp: 2.2222,
  },
  an_ri: {
    vegan: 6.6666,
    donate_to_animalRights: 6.6666,
    cruelty_free: 6.6666,
  },
  labor: {
    childcare: 1.4285,
    gym_recreation: 1.4285,
    educational_ops: 1.4285,
    healthcare: 1.4285,
    mobility: 1.4285,
    can_unionize: 1.4285,
    living_wage: 1.4285,
    safe_work_conditions: 1.4285,
    no_child_labor: 1.4285,
    empower_oppressed: 1.4285,
    co_op: 1.4285,
    ethical_materials_sourcing: 1.4285,
    bcorp: 1.4285,
    fair_trade: 1.4285,
  },
};

const shopifyAxios = axios.create({
  baseURL: "https://ethic-marketplace.myshopify.com/admin/api/2020-01/",
  auth: {
    username: process.env.SHOPIFY_STORE_USERNAME,
    password: process.env.SHOPIFY_STORE_PASSWORD,
  },
});

// @route   GET api/calulate
// @desc    Return calculated default ethic score given shopify product
// @access  Public
router.get("/:productID/:userID?", async (req, res) => {
  try {
    const response = await shopifyAxios.get(
      "products/" + req.params.productID + "/metafields.json"
    );

    const productMetrics = response.data.metafields;
    console.log("userID:" + req.params.userID);
    console.log("productMetrics:" + productMetrics);

    // Return an empty grade if product doesn't have metrics yet.
    if (productMetrics === undefined || productMetrics.length == 0) {
      return res.json({
        defaultScore: 0,
        possibleScore: 0,
        ethicScore: 0,
        grade: "?",
      });
    }

    let defaultScore = 0;
    let possibleScore = 0;
    let userScore = 0;

    //for (const category in productMetrics.data.metafields) {
    for (let i = 0; i < productMetrics.length; ++i) {
      const category = productMetrics[i];
      const cat_values = JSON.parse(category["value"]);

      for (const metric in cat_values) {
        if (category["key"] == "co_im" && metric == "business_size") {
          // Business size affects the default score
          // small = +2, medium = +1, large = +0
          if (cat_values[metric] == "s") {
            defaultScore += 2;
            possibleScore += 2;
          } else if (cat_values[metric] == "m") {
            defaultScore += 1;
            possibleScore += 2;
          } else if (cat_values[metric] == "l") {
            possibleScore += 2;
          }
        } else if (
          category["key"] == "all_n" &&
          (metric == "ewg" || metric == "consumerLabs")
        ) {
          // EWG and Consumer Labs metrics are scaled from 1 to 10
          defaultScore +=
            (metricweights["all_n"][metric] * cat_values[metric]) / 10;
          possibleScore += metricweights["all_n"][metric];
        } else {
          if (cat_values[metric] == "y") {
            defaultScore += metricweights[category["key"]][metric];
            possibleScore += metricweights[category["key"]][metric];
          } else if (cat_values[metric] == "n") {
            possibleScore += metricweights[category["key"]][metric];
          }
        }
      }

      if (req.params.userID !== "undefined") {
        // calculate avg score of user's prefs for current category
        // multiplier = avg_score / 5
        // multiply with the defaultscore and add it to userScore
      }
    }

    let ethicScore = Math.round((defaultScore / possibleScore) * 100);
    let grade = getGrade(ethicScore);

    let results = {
      defaultScore: defaultScore,
      possibleScore: possibleScore,
      ethicScore: ethicScore,
      grade: grade,
    };

    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/*
// @route   GET api/calulate
// @desc    Return calculate ethic score given shopify product and user id
// @access  Public
router.get('/:productID/:userID', async (req, res) => {
  try {
    const user = await shopifyAxios.get('customers/' + req.params.userID + "/metafields.json");
    const productMetrics = await shopifyAxios.get('products/' + req.params.productID + '/metafields.json');
    let defaultScore = 0;
    let possibleScore = 0;

    let i;
    let j;

    //for (const category in productMetrics.data.metafields) {
    for (i = 0; i < productMetrics.data.metafields.length; ++i)  {
        const category = productMetrics.data.metafields[i];
        console.log(category['key']);
        console.log(possibleScore + ' ' + defaultScore);
        if (category['key'] == 'co_im') {
            console.log(category);
            const co_im_values = JSON.parse(category['value']);

            for (const metric in co_im_values) {
            //for (j = 0; j < co_im_values.length; ++j) {
                if (metric == 'business_size') {
                    if (co_im_values[metric] == 's') {
                        defaultScore += 2;
                        possibleScore += 2;
                    }
                    else if (co_im_values[metric] == 'm') {
                        defaultScore += 1;
                        possibleScore += 2;
                    }
                    else if (co_im_values[metric] == 'l') {
                        possibleScore += 2;
                    }

                }
                else {
                    if (co_im_values[metric] == 'y') {
                        defaultScore += metricweights['co_im'][metric];
                        possibleScore += metricweights['co_im'][metric];
                    }
                    else if(co_im_values[metric] == 'n') {
                        possibleScore += metricweights['co_im'][metric];
                    }
                }
            }

        }
        else if (category['key'] == 'all_n') {
            const all_n_values = JSON.parse(category['value']);

            for (const metric in all_n_values) {
                if (metric == 'ewg' || metric == 'consumerLabs') {
                    defaultScore += metricweights['all_n'][metric] * all_n_values[metric] / 10;
                    possibleScore += metricweights['all_n'][metric];
                }
                else {
                    if (all_n_values[metric] == 'y') {
                        defaultScore += metricweights['all_n'][metric];
                        possibleScore += metricweights['all_n'][metric];
                    }
                    else if(all_n_values[metric] == 'n') {
                        possibleScore += metricweights['all_n'][metric];
                    }
                }
            }
        }
        else {
            const cat = category['key'];
            const cat_values = JSON.parse(category['value']);

            for (const metric in cat_values) {
                console.log('thing ' + metricweights[cat][metric]);
                if (cat_values[metric] == 'y') {
                    defaultScore += metricweights[cat][metric];
                    possibleScore += metricweights[cat][metric];

                }
                else if(cat_values[metric] == 'n') {
                     possibleScore += metricweights[cat][metric];
                }
            }
        }
    }

    let results = {
        'defaultScore': defaultScore,
        'possibleScore': possibleScore,
        'ethicScore': defaultScore / possibleScore * 100
    };

    res.json(results);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
*/

function getGrade(score) {
  if (score < 70) {
    return "D";
  } else if (score < 80) {
    return "C";
  } else if (score < 90) {
    return "B";
  } else {
    return "A";
  }
}

module.exports = router;
