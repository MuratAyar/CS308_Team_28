const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Comment = require('../models/Comment')
const {authorizeRole, authenticateToken} = require('../middleware/index')
const {getFilterOptions, searchProducts, updateStock, getAllProducts, filterProducts, 
  addProduct, getIds, deleteProduct, addRating, addComment, getCommentsByProduct, 
  getProductDetails, updateCommentApproval, getPendingComments, applyDiscount,undoDiscount} = require('../controllers/product/product-controller')

router.get('/filters', getFilterOptions);
router.get('/:productId/details', getProductDetails);
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

//comment and rating endpoints
router.post('/:productId/comment', authenticateToken, addComment);
router.post('/:productId/rating', authenticateToken, addRating);
router.get('/:productId/comments', getCommentsByProduct);

//for product manager: getting and updating the pending comments
router.put('/:commentId/update-approval', authenticateToken, authorizeRole('product'), updateCommentApproval);
router.get('/pendingcomments', authenticateToken, authorizeRole('product'), getPendingComments); 
router.put('/discount', authenticateToken, authorizeRole('sales'), applyDiscount);
router.put('/undo-discount', authenticateToken, authorizeRole('sales'), undoDiscount);


  module.exports = router;
