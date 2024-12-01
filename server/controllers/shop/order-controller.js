const Order = require("../../models/Order");
const { sendInvoiceEmail } = require("../../services/mailService");
const User = require('../../models/User'); // Adjust the path as necessary


const createOrder = async (req, res) => {
    const { userId, cartItems, addressInfo, cardNumber, expiryDate, totalAmount } = req.body;

    // Validate card number
    if (!/^\d{16}$/.test(cardNumber) && cardNumber != "null") {
        return res.status(400).json({
            success: false,
            message: "Invalid card number. It must be 16 digits.",
        });
    }

    // Validate expiry date
    const inputDate = new Date(expiryDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (inputDate < tomorrow && inputDate != "null") {
        return res.status(400).json({
            success: false,
            message: "Invalid expiry date. It must be no earlier than tomorrow.",
        });
    }

    try {
        const newOrder = new Order({
            userId,
            cartItems,
            addressInfo,
            totalAmount,
            orderDate: new Date(),
            cardNumber, // Store card info
            expiryDate,
            orderStatus: "processing",
            paymentMethod: "Card",
            paymentStatus: "Pending",
        });

        await newOrder.save();

        // Fetch user's email from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Send the response before sending the email
        res.status(201).json({
            success: true,
            message: "Order created successfully! Invoice email will be sent shortly.",
            orderId: newOrder._id,
        });

        // Attempt to send the invoice email after the response
        try {
            await sendInvoiceEmail(user.email, newOrder);
            console.log("Invoice email sent successfully.");
        } catch (emailError) {
            console.error("Error sending invoice email:", emailError);
        }
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating order.",
        });
    }
};

const changeOrderStatus = async (req, res) => {
    const { orderId } = req.params; // Retrieve order ID from URL params
    const { orderStatus } = req.body; // Retrieve the new order status from the request body

    // Validate the provided status
    if (!orderStatus || !['processing', 'in-transit', 'delivered'].includes(orderStatus)) {
        return res.status(400).json({ error: 'Invalid order status.' });
    }

    try {
        // Find the order by its ID and update the status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { orderStatus }, 
            { new: true } // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to '${orderStatus}' successfully.`,
            order: updatedOrder, // Optional: return the updated order details
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'An error occurred while updating the order status.' });
    }
};
getPendingOrders =  async (req, res) => {
    try {
        // Fetch all orders with statuses 'processing' or 'in-transit'
        const pendingOrders = await Order.find({
            orderStatus: { $in: ['processing', 'in-transit'] }  // Filter by processing or in-transit
        });

        if (pendingOrders.length === 0) {
            return res.status(404).json({ error: 'No pending orders found.' });
        }

        // Return the list of pending orders
        res.status(200).json({
            success: true,
            pendingOrders,
        });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ error: 'An error occurred while fetching pending orders.' });
    }
};
const getDeliveredOrders = async (req, res) => {
    try {
        // Fetch all orders with status 'in-transit'
        const ordersInTransit = await Order.find({ orderStatus: 'in-transit' });

        if (ordersInTransit.length === 0) {
            return res.status(404).json({ error: 'No products to deliver found.' });
        }

        // Extract product details from all orders in-transit
        const productsToDeliver = ordersInTransit.map(order => order.cartItems).flat();

        // Return the list of products that need to be delivered
        res.status(200).json({
            success: true,
            productsToDeliver,
        });
    } catch (error) {
        console.error('Error fetching products to deliver:', error);
        res.status(500).json({ error: 'An error occurred while fetching products to deliver.' });
    }
};

const getAllOrdersByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const orders = await Order.find({ userId });
  
      if (!orders.length) {
        return res.status(404).json({
          success: false,
          message: "No orders found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };

  const getOrderDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
      const order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };

module.exports = { createOrder, changeOrderStatus, getPendingOrders, getDeliveredOrders, getAllOrdersByUser, getOrderDetails};
