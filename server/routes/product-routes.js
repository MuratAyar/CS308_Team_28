const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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


router.get('/all', async (req, res) => {
    const { sort, order = 'asc' } = req.query;

    let sortOptions = {};
    if (sort === 'price') {
        sortOptions.price = order === 'desc' ? -1 : 1;
    } else if (sort === 'popularity') {
        sortOptions.popularity = order === 'desc' ? -1 : 1;
    }

    try {
        const products = await Product.find({}).sort(sortOptions);
        res.json(products);
    } catch (error) {
        console.error('Error fetching and sorting products:', error);
        res.status(500).json({ error: 'Could not fetch products.' });
    }
});



module.exports = router;
