const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Comment = require('../../models/Comment');
const {authorizeRole, authenticateToken} = require('../../middleware/index')
const mongoose = require('mongoose')
const { sendDiscountNotificationEmail } = require("../../services/mailService"); // Import mail service
const Wishlist = require("../../models/Wishlist");
const User = require("../../models/User"); // Ensure this path is correct based on your project structure

const getFilteredProducts = async (req, res) => {
  try {

    const products = await Product.find({});

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

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

    query = query ? query.trim() : "";  // Ensure query is empty string if it's undefined

    try {
        // If query is empty, return all products
        if (!query) {
            const allProducts = await Product.find();  // Fetch all products
            return res.json(allProducts);  // Send the response with all products
        }

        // Search for products where either the 'name' or 'description' matches the query (case-insensitive)
        const results = await Product.find({
            $or: [
                { name: { $regex: new RegExp(query, 'i') } },  // Search in 'name'
                { description: { $regex: new RegExp(query, 'i') } }  // Search in 'description'
            ]
        });

        // Return the search results
        res.json(results);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAllProducts = async (req, res) => {
    const { sort, order = 'asc', page = 1, limit } = req.query;

    // Default sort options
    let sortOptions = {};
    if (sort) {
        sortOptions[sort] = order === 'desc' ? -1 : 1; // Dynamically set the sort field and order
    }

    // Parse page and limit, with default values
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 0; // 0 means no limit (fetch all)

    try {
        // Calculate total products for pagination
        const totalProducts = await Product.countDocuments();

        // Calculate total pages if limit is specified
        const totalPages = limitNumber > 0 ? Math.ceil(totalProducts / limitNumber) : 1;

        // Fetch products with sorting and pagination
        const products = await Product.find({})
            .sort(sortOptions)
            .skip(limitNumber > 0 ? (pageNumber - 1) * limitNumber : 0) // Skip only if limit is applied
            .limit(limitNumber > 0 ? limitNumber : totalProducts); // Limit only if specified

        res.json({
            success: true,
            totalProducts,
            totalPages,
            currentPage: pageNumber,
            products,
        });
    } catch (error) {
        console.error('Error fetching and sorting products:', error);
        res.status(500).json({ error: 'Could not fetch products.' });
    }
};

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
  
  const addComment = async (req, res) => {
    const { productId } = req.params;
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Comment text is required' });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const newComment = await Comment.create({
            user: req.user.id, // Authenticated user ID
            productId, // Link to the product
            content: text, // Comment text
            isApproved: "pending", // Automatically set to false
        });

        return res.status(201).json({
            message: 'Comment added successfully and awaiting approval',
            comment: newComment,
        });
    } catch (err) {
        console.error('Error in addComment:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const addRating = async (req, res) => {
  const { productId } = req.params;
  const { rating } = req.body; // Only expecting rating

  try {
      console.log("Product ID:", productId);
      console.log("Rating from request body:", rating);

      // Validate the productId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ message: 'Invalid product ID' });
      }

      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Validate the rating (should be between 1 and 5)
      if (rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }

      // Update the product's rating
      product.totalRatings += rating; // Add new rating to total
      product.numberOfRatings += 1; // Increment the number of ratings
      product.rating = (product.totalRatings / product.numberOfRatings).toFixed(2); // Recalculate average with 2 decimals

      // Save the product with updated rating
      await product.save();

      res.status(200).json({
          message: 'Rating added successfully',
          product: {
              id: product._id,
              name: product.name,
              rating: product.rating,
              totalRatings: product.totalRatings,
              numberOfRatings: product.numberOfRatings,
          },
      });
  } catch (err) {
      console.error("Error in addRating:", err);
      res.status(500).json({ message: 'Server error' });
  }
};


const getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
      // Validate the productId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ message: 'Invalid product ID' });
      }

      // Find comments where isApproved is true and match the productId
      const comments = await Comment.find({ productId, isApproved: "true" })
          .populate('user', 'userName') // Optional: Populate user details (e.g., userName)
          .sort({ timestamp: -1 }); // Sort by newest comments first

      // If no comments are found, return an empty array instead of a 404 error
      if (comments.length === 0) {
          return res.status(200).json([]); // Return empty array instead of 404
      }

      res.status(200).json({
          message: 'Approved comments retrieved successfully',
          comments,
      });
  } catch (err) {
      console.error('Error in getCommentsByProduct:', err);
      res.status(500).json({ message: 'Server error' });
  }
};


const getProductDetails = async (req, res) => {
  const { productId } = req.params;

  try {
      // Validate the productId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ message: 'Invalid product ID' });
      }

      // Find the product by ID, including its rating and other necessary fields
      const product = await Product.findById(productId, {
          name: 1,
          model: 1,
          description: 1,
          brand: 1,
          price: 1,
          category: 1,
          gender: 1,
          image: 1,
          rating: 1, 
          quantityInStock: 1,
      });

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({
          product: {
              ...product._doc, // Spread the product fields
              rating: product.rating ? product.rating.toFixed(2) : 'No ratings yet', // Format the rating
          },
      });
  } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

const updateCommentApproval = async (req, res) => {
  const { commentId } = req.params;  // Extract the commentId from the URL
  const { isApproved } = req.body;   // Extract the isApproved status from the request body

  // Validate `isApproved`
  const validStatuses = ["true", "false"];
  if (!validStatuses.includes(isApproved)) {
      return res.status(400).json({ message: "Invalid approval status. Use 'true' or 'false'." });
  }

  try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
          return res.status(400).json({ message: "Invalid comment ID." });
      }

      // Find the comment and update the approval status
      const updatedComment = await Comment.findByIdAndUpdate(
          commentId,  // We use commentId to find the comment
          { isApproved },  // Update the approval status
          { new: true }  // Return the updated document
      );

      if (!updatedComment) {
          return res.status(404).json({ message: "Comment not found." });
      }

      res.status(200).json({
          message: "Comment approval status updated successfully.",
          comment: updatedComment,
      });
  } catch (err) {
      console.error("Error in updateCommentApproval:", err);
      res.status(500).json({ message: "Server error." });
  }
};

const getPendingComments = async (req, res) => {
    try {
        // Fetch comments with `isApproved` set to 'pending'
        const pendingComments = await Comment.find({ isApproved: 'pending' })
            .populate('user', 'name email') // Populate user details
            .populate('productId', 'name'); // Populate product details

        // Return the pending comments in response
        res.status(200).json({ success: true, data: pendingComments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error. Unable to fetch pending comments.' });
    }
};


const setProductPrice = async (req, res) => {
    const { productId } = req.params;
    const { price } = req.body;

    if (price == null || price < 0) {
        return res.status(400).json({ error: 'Invalid price value. Price must be a positive number.' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID.' });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { price },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({
            message: 'Product price updated successfully.',
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
            },
        });
    } catch (error) {
        console.error('Error updating product price:', error);
        res.status(500).json({ message: 'Server error. Unable to update product price.' });
    }
};

// server/controllers/product-controller.js

const applyDiscount = async (req, res) => {
    const { productId, discountRate } = req.body;

    // Validate inputs
    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required.' });
    }
    if (discountRate == null || discountRate <= 0 || discountRate > 100) {
        return res.status(400).json({ error: 'Discount rate must be a valid percentage (1-100).' });
    }

    try {
        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Apply discount
        product.salesPrice = parseFloat((product.price * (1.00 - discountRate / 100.00)).toFixed(2));
        await product.save();

        // Fetch all wishlists containing this product
        const wishlists = await Wishlist.find({ "items.productId": productId }).populate('userId', 'email userName');

        if (wishlists.length === 0) {
            console.log('No wishlists contain this product. No emails to send.');
        } else {
            // Extract unique users to avoid sending multiple emails to the same user if they have the product multiple times
            const users = wishlists.map(wishlist => wishlist.userId);
            const uniqueUsersMap = new Map();
            users.forEach(user => {
                if (user && !uniqueUsersMap.has(user._id.toString())) {
                    uniqueUsersMap.set(user._id.toString(), user);
                }
            });
            const uniqueUsers = Array.from(uniqueUsersMap.values());

            // Send emails to all unique users
            const emailPromises = uniqueUsers.map(user => {
                if (user.email) {
                    return sendDiscountNotificationEmail(user.email, product, discountRate);
                } else {
                    console.warn(`User with ID ${user._id} does not have an email address.`);
                    return Promise.resolve(); // Skip users without email
                }
            });

            // Wait for all emails to be sent
            await Promise.all(emailPromises);
            console.log(`Discount notification emails sent to ${uniqueUsers.length} users.`);
        }

        res.status(200).json({
            message: 'Discount applied successfully.',
            product,
        });

    } catch (error) {
        console.error('Error applying discount:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Add this route in your backend
const deleteCategory =  async (req, res) => {
    const { category } = req.params;
  
    try {
      // Delete all products with the given category
      const result = await Product.deleteMany({ category });
  
      if (result.deletedCount > 0) {
        res.json({ success: true, message: `${result.deletedCount} products deleted successfully` });
      } else {
        res.status(404).json({ success: false, error: 'No products found in this category' });
      }
    } catch (error) {
      console.error('Error deleting products by category:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
}
  
const undoDiscount = async (req, res) => {
    const { productId } = req.body;

    // Validate inputs
    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required.' });
    }

    try {
        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        if (product.salesPrice !== null) {
            product.salesPrice = null; 
        }

        await product.save();

        res.status(200).json({
            message: 'Discount undone successfully.',
            product,
        });
    } catch (error) {
        console.error('Error undoing discount:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


  module.exports = {getFilteredProducts, getFilterOptions, searchProducts, deleteProduct, updateStock, 
    getAllProducts, getIds, addProduct, filterProducts, addComment, addRating, getCommentsByProduct, 
    getProductDetails, updateCommentApproval, getPendingComments, setProductPrice, applyDiscount, undoDiscount, deleteCategory}
