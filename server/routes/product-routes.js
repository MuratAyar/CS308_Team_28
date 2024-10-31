const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.get('/all', async (req, res) => {
    console.log("GET /all endpoint hit");
    try {
        const products = await Product.find({});
        console.log("Products:", products); // Log products to confirm
        res.json(products);
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ error: 'Could not fetch products.' });
    }
});


router.get('/search', async (req, res) => {
    let { query } = req.query;

    // Trim the query to remove any whitespace or newline characters
    query = query.trim();

    // Validate the query
    if (!query) {
        return res.status(400).json({ error: 'Query must not be empty' });
    }

    try {
        const results = await Product.find({
            $or: [
                { name: { $regex: new RegExp(query, 'i') } },
                { description: { $regex: new RegExp(query, 'i') } }
            ]
        });

        res.json(results);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
