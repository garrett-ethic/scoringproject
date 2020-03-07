const express = require('express');
const router = express.Router();
const axios = require('axios');
const ShopifyUser = require('../../models/ShopifyUser');

const shopifyAxios = axios.create({
    baseURL: 'https://ethic-marketplace.myshopify.com/admin/api/2020-01/customers',
    auth: {
        username: process.env.SHOPIFY_USERNAME,
        password: process.env.SHOPIFY_PASSWORD
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await shopifyAxios.get(req.params.id + '.json');
        
        // user isnt null if its not there, look up how to handle this properly
        // (besides giving a 404)
        // if (user == null) {
        //     return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
        // }
        
        console.log(user.data['customer']['note']);
        res.json(user.data['customer']);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    console.log(req.body);
    const { note } = req.body;
    console.log(note);

    try {
        // this doesnt work and i dont know why lol
        const user = await shopifyAxios.put(req.params.id + '.json', {data: 
            {
                "customer": {
                    "note": note
                }
            }});
        console.log(user);
        res.json(user.data['customer']);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;