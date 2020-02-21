const express = require('express');
const router = express.Router();
const Conditioner = require('../../models/Conditioner');
const FaceWash = require('../../models/Facewash');
const Lotion = require('../../models/Lotion');
const Shampoo = require('../../models/Shampoo');
const SkinCare = require('../../models/SkinCare');
const Sunscreen = require('../../models/Sunscreen');

// @route   GET api/calulate
// @desc    Return Graded user preferences when given an input form
// @access  Public
router.get('/', (req, res) => {
  try {
    // res.json({ msg: 'Test request Works!' });

    const { envInput, socialInput } = req.body;

    inputs = {
      envInput,
      socialInput
    };

    scores = {
      envScore: 'A',
      socialScore: 'B'
    };

    res.json(scores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/calulate
// @desc    add a new product to the db
// @access  Public
router.post('/', async (req, res) => {
    console.log(req.body)

    const { category, name, brand, metrics } = req.body;

    try {
        
        //implement switch to determine product category
        let product = await Shampoo.findOne({name});
        
        if (product) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Product already exists' }] });
        }

        product = new Shampoo({
            name, 
            brand, 
            metrics
        });

        res.send({
            message:'Sent product',
            sku:req.body.sku,
            name:req.body.name,
            criterias:req.body.criteria
        });
        await product.save();
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;