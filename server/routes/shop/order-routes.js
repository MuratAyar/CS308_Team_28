const express = require("express");
const { createOrder, changeOrderStatus, getPendingOrders, getDeliveredOrders, getAllOrdersByUser, getOrderDetails, viewAllOrders} = require("../../controllers/shop/order-controller");
const {authenticateToken, authorizeRole} = require('../../middleware/index')
const router = express.Router();

//THESE SHOULD BE NON-AUTH. DO NOT CHANGE!!
router.post("/create", createOrder);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

router.put('/update-order-status/:orderId', authenticateToken, authorizeRole('product', 'admin'), changeOrderStatus)
router.get('/pending-orders', authenticateToken, authorizeRole('product', 'admin'), getPendingOrders)
router.get('/products-to-deliver', authenticateToken, authorizeRole('product', 'admin'), getDeliveredOrders)
router.get("/allOrders", authenticateToken, authorizeRole('product', 'admin'), viewAllOrders)
module.exports = router;