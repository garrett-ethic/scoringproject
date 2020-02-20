const express = require('express');
const router = express.Router();

// add a new product to the db
router.post('/products', function(req, res){
    console.log(req.body)
    res.send({
        message:'Sent product',
        sku:req.body.sku,
        name:req.body.name,
        criterias:req.body.criteria
    });
});

router.param('name', function(req, res, next, name) {

    // check if the user with that name exists
    // do some validations
    // add -dude to the name
    var modified = name + '-ethical';

    // save name to the request
    req.name = modified;

    next();
});

// get a product from the db
router.get('/products/:name', function(req, res){
    console.log(req.name);
    res.send('product name is: ' + req.name);
});

module.exports = router;

