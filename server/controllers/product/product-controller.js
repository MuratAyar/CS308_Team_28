const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const {authorizeRole, authenticateToken} = require('../../middleware/index')

const getFilterOptions = async (req, res) => {
  try {
      // Get distinct values for each filter field
      const categories = await Product.distinct('category');
      const brands = await Product.distinct('brand');
      const genders = await Product.distinct('gender');

      // Calculate price range
      const priceStats = await Product.aggregate([
          {
              $group: {
                  _id: null,
                  minPrice: { $min: "$price" },
                  maxPrice: { $max: "$price" }
              }
          }
      ]);
      const priceRange = priceStats.length ? { min: priceStats[0].minPrice, max: priceStats[0].maxPrice } : { min: 0, max: 0 };

      
      const inStockOptions = [true, false]; // Boolean options for in-stock status

      
      const ratings = await Product.distinct('rating');

      
      res.json({
          categories,
          brands,
          genders,
          priceRange,
          inStockOptions,
          ratings
      });
  } catch (error) {
      console.error('Error fetching filter options:', error);
      res.status(500).json({ error: 'Could not fetch filter options' });
  }
};

const searchProducts = async (req, res) => {
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
};

const getAllProducts = async (req, res) => {
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
}
const filterProducts = async (req, res) => {
  const { category, brand, minPrice, maxPrice, inStock, rating, gender, page = 1, limit = 10, sort, order = 'asc' } = req.query;

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

  // Add sort options
  let sortOptions = {};
  if (sort) {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
  }

  try {
      // Calculate total products for pagination
      const totalProducts = await Product.countDocuments(filter);

      // Calculate the total pages
      const totalPages = Math.ceil(totalProducts / limitNumber);

      // Fetch filtered products with sorting and pagination
      const products = await Product.find(filter)
          .sort(sortOptions) // Apply the sort options here
          .limit(limitNumber)
          .skip((pageNumber - 1) * limitNumber);

      res.json({
          totalProducts,
          totalPages,
          currentPage: pageNumber,
          products
      });
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products', error });
  }
};


 const updateStock =  async (req, res) => {
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
}


 const addProduct = async (req, res) => {
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
  }


  const getIds = async (req, res) => {
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
  }


  const deleteProduct = async (req, res) => {
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
  }

  module.exports = { getFilterOptions, searchProducts, deleteProduct, updateStock,getAllProducts, getIds, addProduct, filterProducts}
