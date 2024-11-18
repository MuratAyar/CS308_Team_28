const mongoose = require('mongoose')
const Cart = require('./Cart')

const OrderSchema = new mongoose.Schema({
    userId : String,
    cartItems:[{
        productId : String,
        title: String,
        image: String,
        price: String,
        salePrice: String,
        quantity : Number
    }
    ],
    addressInfo : {
        addressId : String,
        address : String,
        city : String,
        pincode : String,
        phone : String,
        notes: String

    },
    orderStatus : String,
    paymentMethod : String,
    paymentStatus : String,
    totalAmount : Number,
    orderDate : Date,
    orderUpdateDate : Date,
    paymentId: String,
    payerId : String,
    cardNumber: String, // Added for payment
    expiryDate: String, // Added for payment
});

module.exports = mongoose.model('Order', OrderSchema)