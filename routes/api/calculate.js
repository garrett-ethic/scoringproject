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

ethic_ctgry = ["co_im", "eco_f", "all_n", "an_ri", "labor"];

const shopifyAxios = axios.create({
  // have to update 20XX-XX to latest after a year
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
    // productMetrics and userMetrics are lists of metrics
    const product_res = await shopifyAxios.get(
      "products/" + req.params.productID + "/metafields.json"
    );
    const productMetrics = product_res.data.metafields;

    // Return an empty grade if product doesn't have metrics yet.
    if (productMetrics === undefined || productMetrics.length == 0) {
      return res.json({
        defaultScore: 0,
        possibleScore: 0,
        ethicScore: 0,
        grade: "?",
      });
    }

    let multindex = {}, user_exists = false;
    if (typeof req.params.userID !== "undefined") {
      let user_res = await shopifyAxios.get(
        "customers/" + req.params.userID + "/metafields.json"
      );
      let userMetrics = user_res.data.metafields;

      if (userMetricsExist(userMetrics)) {
        user_exists = true;
        for (let i = 0; i < ethic_ctgry.length; ++i) {
          metric = userMetrics.filter((cat) => {
            return cat.key === ethic_ctgry[i];
          });

          // map user pref to (0.5 to 1 from 1 to 5; 1 to 2 from 5 to 10)
          if (metric[0].value <= 5) {
            multindex[i] = scale(metric[0].value, 1, 5, 0.5, 1);
          } else {
            multindex[i] = scale(metric[0].value, 5, 10, 1, 2);
          }
        }
      }
    }

    let defaultScore = { "co_im": 0, "eco_f": 0, "all_n": 0, "an_ri": 0, "labor": 0 }
    let possibleScore = { "co_im": 0, "eco_f": 0, "all_n": 0, "an_ri": 0, "labor": 0 };

    for (let i = 0; i < productMetrics.length; ++i) {
      let cat_score = 0; // represents defaultScore of each category
      let cat_pscore = 0; // represents possibleScore of each category
      let cruelty_free = false;
      const category = productMetrics[i]; // metafield object of the ethic category (co_im, an_ri, etc.)
      const cat_values = JSON.parse(category["value"]); // values from the metafield object above
      // console.log(category["key"], cat_values);

      for (const metric in cat_values) {
        // console.log(metric, ':', metricweights[category["key"]][metric], cat_values[metric]);
        if (metric === "business_size") {
          // Business size affects the default score
          // small = +2, medium = +1, large = +0
          if (cat_values[metric] == "s") {
            cat_score += metricweights["co_im"]["business_size"];
            cat_pscore += metricweights["co_im"]["business_size"];
          } else if (cat_values[metric] == "m") {
            cat_score += metricweights["co_im"]["business_size"] / 2;
            cat_pscore += metricweights["co_im"]["business_size"];
          } else if (cat_values[metric] == "l") {
            cat_pscore += metricweights["co_im"]["business_size"];
          }
        } else if (metric == "ewg" || metric == "consumerLabs") {
          // EWG and Consumer Labs metrics are scaled from 1 to 10 (EWG is inversed, lower is better)
          if (metric == "ewg" && cat_values["ewg"] !== "n/a") {
            cat_score += (metricweights["all_n"][metric] * (10 - cat_values[metric])) / 10;
            cat_pscore += metricweights["all_n"][metric];
          } else if (metric == "consumerLabs" && cat_values["consumerLabs"] !== "n/a") {
            cat_score += (metricweights["all_n"][metric] * cat_values[metric]) / 10;
            cat_pscore += metricweights["all_n"][metric];
          }
        } else if (metric === "transparency") {
          if (cat_values[metric] == "h") {
            cat_score += metricweights["all_n"]["transparency"];
            cat_pscore += metricweights["all_n"]["transparency"];
          } else if (cat_values[metric] == "m") {
            cat_score += metricweights["all_n"]["transparency"] / 2;
            cat_pscore += metricweights["co_im"]["transparency"];
          } else if (cat_values[metric] == "l") {
            cat_pscore += metricweights["co_im"]["transparency"];
          }
        } else if (metric == "bcorp") {
          // this accounts for bcorp within co_im, eco_f, all_n, and labor respectively
          // CHANGE THIS TO REFERENCE THE METRIC WEIGHTS INSTEAD OF RAW VALUES
          // also, need to make sure they actually go to the right category instead of all labor.
          if (cat_values[metric] == "y") {
            defaultScore["co_im"] += 2;
            defaultScore["eco_f"] += 2;
            defaultScore["all_n"] += 2.2222;
            cat_score += 1.4285;
            possibleScore["co_im"] += 2;
            possibleScore["eco_f"] += 2;
            possibleScore["all_n"] += 2.2222;
            cat_pscore += 1.4285;
          } else if (cat_values[metric] == "n") {
            possibleScore["co_im"] += 2;
            possibleScore["eco_f"] += 2;
            possibleScore["all_n"] += 2.2222;
            cat_pscore += 1.4285;
          }
        } else if (metric == "plastic_free" || metric == "compostable") {
          // these just hold certification that dont impact calculations
          continue;
        } else if (metric == "leaping_bunny" || metric == "peta") {
          // if the product is either leaping bunny or peta certified, award the cruelty_free weight to the score
          if (cruelty_free) {
            continue;
          } else if (cat_values["leaping_bunny"] == "y" || cat_values["peta"] == "y") {
            cat_score += metricweights[category["key"]]["cruelty_free"];
            cat_pscore += metricweights[category["key"]]["cruelty_free"];
            cruelty_free = true;
          } else if (cat_values["leaping_bunny"] == "n" && cat_values["peta"] == "n") {
            cat_pscore += metricweights[category["key"]]["cruelty_free"];
            cruelty_free = true;
          } else if (cat_values["leaping_bunny"] == "n" && cat_values["peta"] == "n/a") {
            cat_pscore += metricweights[category["key"]]["cruelty_free"];
            cruelty_free = true;
          } else if (cat_values["leaping_bunny"] == "n/a" && cat_values["peta"] == "n") {
            cat_pscore += metricweights[category["key"]]["cruelty_free"];
            cruelty_free = true;
          }
        } else {
          if (cat_values[metric] == "y") {
            cat_score += metricweights[category["key"]][metric];
            cat_pscore += metricweights[category["key"]][metric];
          } else if (cat_values[metric] == "n") {
            cat_pscore += metricweights[category["key"]][metric];
          }
        }
      }
      // console.log('  ', category["key"], 'd/p-score:', cat_score, cat_pscore);
      defaultScore[category["key"]] += cat_score;
      possibleScore[category["key"]] += cat_pscore;
    }
    let userDScore = {}, userPScore = {};
    if (user_exists) {
      for (let i = 0; i < ethic_ctgry.length; ++i) {
        userDScore[ethic_ctgry[i]] = defaultScore[ethic_ctgry[i]] * multindex[ethic_ctgry[i]];
        userPScore[ethic_ctgry[i]] = possibleScore[ethic_ctgry[i]] * multindex[ethic_ctgry[i]];
      }
    }

    let results = {
      defaultScore: defaultScore,
      possibleScore: possibleScore,
      ethicScore: Math.round((sumScore(defaultScore) / sumScore(possibleScore)) * 100),
      ethicGrade: getGrade(Math.round((sumScore(defaultScore) / sumScore(possibleScore)) * 100)),
      userDScore: userDScore,
      userPScore: userPScore,
      userScore: Math.round((sumScore(userDScore) / sumScore(userPScore)) * 100),
      userGrade: getGrade(Math.round((sumScore(userDScore) / sumScore(userPScore)) * 100)),
    };
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

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

function userMetricsExist(userMetrics) {
  return userMetrics.some(cat => cat.key === "co_im") &&
    userMetrics.some(cat => cat.key === "eco_f") &&
    userMetrics.some(cat => cat.key === "all_n") &&
    userMetrics.some(cat => cat.key === "an_ri") &&
    userMetrics.some(cat => cat.key === "labor");
};

function scale(num, in_min, in_max, out_min, out_max) {
  return (
    ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  );
};

function sumScore(score) {
  let sum = 0;
  for (const category in score) {
    sum += score[category];
  }
  return sum;
}

module.exports = router;
