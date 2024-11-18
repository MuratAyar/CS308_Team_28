const Order = require("../../models/Order");

const createOrder = async (req, res) => {
    const { userId, cartItems, addressInfo, cardNumber, expiryDate, totalAmount } = req.body;

    // Validate card number
    if (!/^\d{16}$/.test(cardNumber)) {
        return res.status(400).json({
            success: false,
            message: "Invalid card number. It must be 16 digits.",
        });
    }

    // Validate expiry date
    const inputDate = new Date(expiryDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (inputDate < tomorrow) {
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
            orderStatus: "Pending",
            paymentMethod: "Card",
            paymentStatus: "Pending",
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully!",
            orderId: newOrder._id,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating order.",
        });
    }
};

module.exports = { createOrder };
