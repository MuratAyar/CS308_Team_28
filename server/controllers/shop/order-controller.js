const bcrypt = require('bcryptjs');
const Order = require("../../models/Order");
const Product = require('../../models/Product');
const { sendInvoiceEmail, sendRefundNotificationEmail } = require("../../services/mailService");
const User = require('../../models/User'); // Adjust the path as necessary


const createOrder = async (req, res) => {
    const { userId, cartItems, addressInfo, cardNumber, expiryDate, totalAmount, paymentMethod } = req.body;

    console.log("Creating order with payment method:", paymentMethod);

    try {
        // Basic validation
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart items are required and must be a non-empty array.",
            });
        }

        if (!addressInfo || !addressInfo.address || !addressInfo.city || !addressInfo.pincode || !addressInfo.phone) {
            return res.status(400).json({
                success: false,
                message: "Complete address information is required.",
            });
        }

        // Card validation only if payment method is Card
        if (paymentMethod === "Card") {
            // Validate card number
            if (!cardNumber || (!/^\d{16}$/.test(cardNumber) && cardNumber !== "null")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid card number. It must be 16 digits.",
                });
            }

            // Validate expiry date
            if (!expiryDate || expiryDate === "null") {
                return res.status(400).json({
                    success: false,
                    message: "Card expiry date is required.",
                });
            }

            const inputDate = new Date(expiryDate);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (isNaN(inputDate.getTime()) || inputDate < tomorrow) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid expiry date. It must be in the future.",
                });
            }
        }

        // Hash card details if provided
        const hashedCardNumber = cardNumber !== "null" ? await bcrypt.hash(cardNumber, 12) : "null";
        const hashedExpiryDate = expiryDate !== "null" ? await bcrypt.hash(expiryDate, 12) : "null";

        const newOrder = new Order({
            userId,
            cartItems,
            addressInfo,
            totalAmount,
            orderDate: new Date(),
            cardNumber: hashedCardNumber,
            expiryDate: hashedExpiryDate,
            orderStatus: "processing",
            paymentMethod: paymentMethod || "Card",
            paymentStatus: "Done",
        });

        // Check product stock before finalizing the order
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
            }

            // Ensure there is enough stock
            if (product.quantityInStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.name}. Only ${product.quantityInStock} available.`,
                });
            }
        }

        // Save the order
        await newOrder.save();

        // Update product stock
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);
            product.quantityInStock -= item.quantity; // Decrease stock
            product.popularity += 1; // Increase popularity
            await product.save(); // Save the updated product
        }

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
            message: "Error creating order: " + error.message,
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

const cancelOrRefundOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ success: false, message: "Order not found." });
      }

      // 30-day refund validation
      const currentDate = new Date();
      const orderDate = new Date(order.orderDate);
      const diffInDays = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));

      if (diffInDays > 30) {
          return res.status(400).json({ success: false, message: "Refund can only be requested within 30 days of purchase." });
      }

      // Process cancelation or refund based on order status
      if (order.orderStatus === 'processing') {
          for (const item of order.cartItems) {
              const product = await Product.findById(item.productId);
              if (product) {
                  product.quantityInStock += item.quantity;
                  await product.save();
              }
          }
          order.orderStatus = 'cancelled';
      } else if (['in-transit', 'delivered'].includes(order.orderStatus)) {
          order.orderStatus = 'waiting-for-refund';
      } else {
          return res.status(400).json({ success: false, message: "Invalid order status for cancellation or refund." });
      }

      await order.save();
      res.status(200).json({ success: true, message: "Order status updated successfully.", order });
  } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ success: false, message: "An error occurred while updating the order status." });
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
  const viewAllOrders = async (req, res) => {
    try {
      const orders = await Order.find(); // Retrieves all orders as-is from the database
      res.status(200).json({
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      });
    } catch (error) {
      console.error("Error retrieving orders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve orders",
      });
    }
  };

  const calculateRevenueAndLoss = async (req, res) => {
    try {
      // Extract 'startDate' and 'endDate' from the query parameters
      const { startDate, endDate } = req.query;
  
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Both 'startDate' and 'endDate' are required." });
      }
  
      // Parse and format dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
  
      // Fetch all orders within the date range
      const orders = await Order.find({
        orderDate: {
          $gte: start,
          $lte: end,
        },
      });
  
      // Initialize counters
      let totalRevenue = 0;
      let totalLoss = 0;
      const revenueBreakdown = {};
      const lossBreakdown = {};
  
      // Process each order to calculate revenue and loss
      orders.forEach(order => {
        order.cartItems.forEach(item => {
          const quantity = item.quantity || 1;
          const productKey = item.title || item.productId; // Use title if available, otherwise productId
  
          // Calculate revenue: original sale price or salesPrice
          const revenue = item.salesPrice 
            ? parseFloat(item.salesPrice) * quantity 
            : parseFloat(item.price) * quantity;
  
          // Add to total revenue
          totalRevenue += revenue;
  
          // Add to revenue breakdown
          if (revenueBreakdown[productKey]) {
            revenueBreakdown[productKey] += revenue;
          } else {
            revenueBreakdown[productKey] = revenue;
          }
  
          // Calculate loss if salesPrice exists
          if (item.salesPrice) {
            const originalPrice = parseFloat(item.price) * quantity;
            const salesPrice = parseFloat(item.salesPrice) * quantity;
  
            const loss = originalPrice - salesPrice;
  
            // Add to total loss
            totalLoss += loss;
  
            // Add to loss breakdown
            if (lossBreakdown[productKey]) {
              lossBreakdown[productKey] += loss;
            } else {
              lossBreakdown[productKey] = loss;
            }
          }
        });
      });
  
      // Format revenue and loss breakdown for response
      const formattedRevenueBreakdown = Object.entries(revenueBreakdown).map(([product, amount]) => ({
        product,
        revenue: amount.toFixed(2),
      }));
  
      const formattedLossBreakdown = Object.entries(lossBreakdown).map(([product, amount]) => ({
        product,
        loss: amount.toFixed(2),
      }));
  
      // Response with all the aggregated data
      return res.status(200).json({
        success: true,
        totalRevenue: totalRevenue.toFixed(2),
        totalLoss: totalLoss.toFixed(2),
        startDate: startDate,
        endDate: endDate,
        ordersCount: orders.length,
        revenueBreakdown: formattedRevenueBreakdown,
        lossBreakdown: formattedLossBreakdown,
      });
    } catch (error) {
      console.error("Error calculating revenue and loss:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const getWaitingRefunds = async (req, res) => {
    try {
      // Fetch all orders with status 'waiting-for-refund'
      const waitingRefunds = await Order.find({ orderStatus: 'waiting-for-refund' }).populate('userId', 'name email'); // Populating user details if needed
  
      res.status(200).json({
        success: true,
        count: waitingRefunds.length,
        data: waitingRefunds,
      });
    } catch (error) {
      console.error('Error fetching waiting refunds:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error: Unable to fetch waiting refunds.',
      });
    }
  };

  const evaluateRefund = async (req, res) => {
    const { orderId } = req.body;

    // Validate request
    if (!orderId) {
        return res.status(400).json({
            success: false,
            message: "Order ID is required.",
        });
    }

    try {
        // Find the order by ID
        const order = await Order.findById(orderId);

        // Check if order exists
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        // Check if the current status is 'waiting-for-refund'
        if (order.orderStatus !== "waiting-for-refund") {
            return res.status(400).json({
                success: false,
                message: `Cannot evaluate refund for orders with status '${order.orderStatus}'.`,
            });
        }

        // Update the order status to 'refund-approved'
        order.orderStatus = "refund-approved";
        order.refundApprovedBy = req.user.id; // Assuming you track who approved the refund
        order.refundApprovedAt = Date.now();

        // Save the updated order
        await order.save();

        // Re-increase product quantities based on cartItems
        const productUpdates = order.cartItems.map(async (item) => {
            try {
                // Find the product by productId
                const product = await Product.findById(item.productId);
                if (product) {
                    product.quantityInStock += item.quantity; // Increase stock by the quantity in the order
                    await product.save();
                } else {
                    console.error(`Product with ID ${item.productId} not found.`);
                }
            } catch (productError) {
                console.error(`Error updating product stock for ID ${item.productId}:`, productError);
            }
        });

        // Wait for all product updates to complete
        await Promise.all(productUpdates);

        // Notify user via email
        try {
            const user = await User.findById(order.userId); // Ensure you have the user email
            if (user) {
                const product = order.cartItems[0]; // Replace with actual structure
                await sendRefundNotificationEmail(user.email, product); // Ensure await is used
                console.log("Refund notification email sent successfully.");
            } else {
                console.error("User not found for email notification.");
            }
        } catch (emailError) {
            console.error("Error sending refund notification email:", emailError);
        }

        res.status(200).json({
            success: true,
            message: "Refund approved successfully.",
            data: order,
        });
    } catch (error) {
        console.error("Error evaluating refund:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Unable to evaluate refund.",
        });
    }
};





module.exports = { createOrder, changeOrderStatus, getPendingOrders, getDeliveredOrders, getAllOrdersByUser, 
  getOrderDetails, viewAllOrders, calculateRevenueAndLoss, cancelOrRefundOrder, getWaitingRefunds, evaluateRefund};
