const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/search', async (req, res) => {
    let { query } = req.query;

    
    query = query.trim();

    
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


// Route to Get All Products with Sorting and Pagination
router.get('/all', async (req, res) => {
    const { sort, order = 'asc', page = 1, limit = 10 } = req.query;

    let sortOptions = {};
    if (sort === 'price') {
        sortOptions.price = order === 'desc' ? -1 : 1;
    } else if (sort === 'popularity') {
        sortOptions.popularity = order === 'desc' ? -1 : 1;
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    try {
        // Calculate total products for pagination
        const totalProducts = await Product.countDocuments();

        // Calculate the total pages
        const totalPages = Math.ceil(totalProducts / limitNumber);

        // Fetch all products with sorting and pagination
        const products = await Product.find({})
            .sort(sortOptions)
            .limit(limitNumber)
            .skip((pageNumber - 1) * limitNumber);

        res.json({
            totalProducts,
            totalPages,
            currentPage: pageNumber,
            products
        });
    } catch (error) {
        console.error('Error fetching and sorting products:', error);
        res.status(500).json({ error: 'Could not fetch products.' });
    }
});





// Route to Get Products with Filtering and Pagination
router.get('/filter', async (req, res) => {
    const { category, brand, minPrice, maxPrice, inStock, rating, gender, page = 1, limit = 10 } = req.query;
  
    // Build filter object based on query parameters
    let filter = {};
  
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (gender) filter.gender = gender;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (inStock !== undefined) filter.quantityInStock = { $gte: inStock === 'true' ? 1 : 0 };
    if (rating) filter.rating = { $gte: Number(rating) };
  
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
  
    try {
      // Calculate total products for pagination
      const totalProducts = await Product.countDocuments(filter);
  
      // Calculate the total pages
      const totalPages = Math.ceil(totalProducts / limitNumber);
  
      // Fetch filtered products with pagination
      const products = await Product.find(filter)
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber);
  
      res.json({
        totalProducts,
        totalPages,
        currentPage: pageNumber,
        products
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  });
  


router.put('/update-stock/:id', async (req, res) => {
    const { id } = req.params;
    const { newQuantity } = req.body;

    // Validate the new quantity
    if (newQuantity == null || newQuantity < 0) {
        return res.status(400).json({ error: 'Invalid stock quantity' });
    }

    try {
        // Find the product by ID and update the quantity
        const product = await Product.findByIdAndUpdate(
            id,
            { quantityInStock: newQuantity },
            { new: true, runValidators: true }
        );

        // If product is not found, return an error
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Respond with the updated product
        res.json({ message: 'Stock quantity updated successfully', product });
    } catch (error) {
        console.error('Error updating stock quantity:', error);
        res.status(500).json({ error: 'Server error' });
    }
});




  module.exports = router;
