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

    let user_res, userMetrics;
    if (typeof req.params.userID !== "undefined") {
      user_res = await shopifyAxios.get(
        "customers/" + req.params.userID + "/metafields.json"
      );
      userMetrics = user_res.data.metafields;
    }

    let defaultScore = 0, possibleScore = 0;
    let userDScore = 0, userPScore = 0;

    //for (const category in productMetrics.data.metafields) {
    for (let i = 0; i < productMetrics.length; ++i) {
      let cat_score = 0; // represents defaultScore of each category
      let cat_pscore = 0; // represents possibleScore of each category
      let cruelty_free = false;
      const category = productMetrics[i];
      const cat_values = JSON.parse(category["value"]);

      for (const metric in cat_values) {
        console.log(metric, ':', metricweights[category["key"]][metric], cat_values[metric]);
        if (category["key"] === "co_im" && metric === "business_size") {
          // Business size affects the default score
          // small = +2, medium = +1, large = +0
          if (cat_values[metric] == "s") {
            cat_score += 2;
            cat_pscore += 2;
          } else if (cat_values[metric] == "m") {
            cat_score += 1;
            cat_pscore += 2;
          } else if (cat_values[metric] == "l") {
            cat_pscore += 2;
          }
        } else if (
          category["key"] === "all_n" &&
          (metric === "ewg" || metric === "consumerLabs")
        ) {
          // EWG and Consumer Labs metrics are scaled from 1 to 10
          console.log((metricweights["all_n"][metric] * cat_values[metric]) / 10);
          cat_score +=
            (metricweights["all_n"][metric] * cat_values[metric]) / 10;
          cat_pscore += metricweights["all_n"][metric];
        } else if (metric == "bcorp") {
          // this accounts for bcorp within co_im, eco_f, all_n, and labor respectively
          if (cat_values[metric] == "y") {
            cat_score += 2 + 2 + 2.2222 + 1.4285;
            cat_pscore += 2 + 2 + 2.2222 + 1.4285;
          } else if (cat_values[metric] == "n") {
            cat_pscore += 2 + 2 + 2.2222 + 1.4285;
          }
        } else if (metric == "plastic_free" || metric == "compostable") {
          continue;
        } else if (metric == "leaping_bunny" || metric == "peta") {
          if (cruelty_free) {
            continue;
          } else if (cat_values["leaping_bunny"] == "y" || cat_values["peta"] == "y") {
            cat_score += metricweights[category["key"]]["cruelty_free"];
            cat_pscore += metricweights[category["key"]]["cruelty_free"];
            cruelty_free = true;
          } else {
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

      if (typeof req.params.userID !== "undefined" && userMetrics.length == 5) {
        // get user's prefs for current category
        // (make the userMetrics key line up with the category["key"])
        //    we can delete a lot of this if statement that way
        let mult = userMetrics.filter((cat) => {
          return cat.key === category["key"];
        });
        mult = mult[0].value;

        const scale = (num, in_min, in_max, out_min, out_max) => {
          return (
            ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
          );
        };

        // // map user pref to (0.5 to 1 from 1 to 5; 1 to 2 from 5 to 10)
        // if (mult <= 5) {
        //   mult = scale(mult, 1, 5, 0.5, 1);
        // } else {
        //   mult = scale(mult, 5, 10, 1, 2);
        // }

        // OR map user pref to (0.1 to 1.0)
        mult = scale(mult, 1, 10, 0.1, 1.0);

        // multiply with the cat_score and add it to userDScore
        userDScore += cat_score * mult;
        userPScore += cat_pscore * mult;
      }
      console.log('  d/p-score:', cat_score, cat_pscore);
      defaultScore += cat_score;
      possibleScore += cat_pscore;
    }

    let results = {
      userScore: Math.round((userDScore / userPScore) * 100),
      userGrade: getGrade(Math.round((userDScore / userPScore) * 100)),
      ethicScore: Math.round((defaultScore / possibleScore) * 100),
      ethicGrade: getGrade(Math.round((defaultScore / possibleScore) * 100)),
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

module.exports = router;
