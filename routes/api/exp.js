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

// get a product from the db
router.get('/products', function(req, res){
    res.send({type:'GET'});
});

module.exports = router;

