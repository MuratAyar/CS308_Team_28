const express = require("express");
const { createOrder, changeOrderStatus, getPendingOrders, getDeliveredOrders, getAllOrdersByUser, 
    getOrderDetails, viewAllOrders, calculateRevenueAndLoss, cancelOrRefundOrder, getWaitingRefunds,
    evaluateRefund} = require("../../controllers/shop/order-controller");
const {authenticateToken, authorizeRole} = require('../../middleware/index')
const router = express.Router();

//THESE SHOULD BE NON-AUTH. DO NOT CHANGE!!
router.post("/create", createOrder);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.put('/cancel-or-refund/:orderId', cancelOrRefundOrder);
router.get('/waiting-refunds', authenticateToken, authorizeRole('sales'), getWaitingRefunds)
router.put('/evaluate-refund', authenticateToken, authorizeRole('sales'), evaluateRefund)

router.put('/update-order-status/:orderId', authenticateToken, authorizeRole('product', 'admin'), changeOrderStatus)
router.get('/pending-orders', authenticateToken, authorizeRole('product', 'admin'), getPendingOrders)
router.get('/products-to-deliver', authenticateToken, authorizeRole('product', 'admin'), getDeliveredOrders)
router.get("/allOrders", authenticateToken, authorizeRole('product', 'admin'), viewAllOrders)
router.get("/revenueAndLoss", authenticateToken, authorizeRole('sales', 'admin'), calculateRevenueAndLoss)

module.exports = router;