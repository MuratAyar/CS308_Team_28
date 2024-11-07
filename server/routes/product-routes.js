const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const {authorizeRole, authenticateToken} = require('../middleware/index')
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
  


router.put('/update-stock/:id',authenticateToken, authorizeRole('user'), async (req, res) => {
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

// Add a new product
router.post('/add', async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        product: newProduct,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while adding the product',
        error,
      });
    }
  });

// Get Product IDs based on name, distributor, and serialNumber from request body
router.post('/get-ids', async (req, res) => {
  const { name, distributor, serialNumber } = req.body;

  if (!name || !distributor || !serialNumber) {
    return res.status(400).json({ error: 'Name, distributor, and serial number are required' });
  }

  try {
    const products = await Product.find(
      { name, distributor, serialNumber },
      { _id: 1 } // Only return the _id field
    );

    const productIds = products.map(product => product._id);

    res.json({
      success: true,
      productIds,
    });
  } catch (error) {
    console.error('Error retrieving product IDs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a product by _id (as query parameter)
router.delete('/delete', async (req, res) => {
  const { _id } = req.query;  // Retrieve _id from query parameters

  if (!_id) {
    return res.status(400).json({ error: 'Product _id is required' });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(_id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the product',
      error,
    });
  }
});
  module.exports = router;
