const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Comment = require('../models/Comment')
const {authorizeRole, authenticateToken} = require('../middleware/index')
const {getFilterOptions, searchProducts, updateStock, getAllProducts, filterProducts, 
  addProduct, getIds, deleteProduct, addRating, addComment} = require('../controllers/product/product-controller')


router.get('/filters', getFilterOptions);

router.get('/search', searchProducts);
// Route to Get All Products with Sorting and Pagination
router.get('/all', getAllProducts);
// Route to Get Products with Filtering and Pagination
router.get('/filter', filterProducts);
router.put('/update-stock/:id',authenticateToken, authorizeRole('product'), updateStock);
// Add a new product
router.post('/add', addProduct);
// Get Product IDs based on name, distributor, and serialNumber from request body
router.post('/get-ids', getIds);
// Delete a product by _id (as query parameter)
router.delete('/delete', deleteProduct);
router.post('/:productId/comment', authenticateToken, addComment);
router.post('/:productId/rating', authenticateToken, addRating);

  module.exports = router;
