const express = require("express");
const { createOrder, changeOrderStatus, getPendingOrders, getDeliveredOrders, getAllOrdersByUser, getOrderDetails} = require("../../controllers/shop/order-controller");
const {authenticateToken, authorizeRole} = require('../../middleware/index')
const router = express.Router();

router.post("/create", createOrder);
router.put('/update-order-status/:orderId', authenticateToken, authorizeRole('user'), changeOrderStatus)
router.get('/pending-orders', authenticateToken, authorizeRole('product'), getPendingOrders)
router.get('/products-to-deliver', authenticateToken, authorizeRole('product'), getDeliveredOrders)
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
module.exports = router;