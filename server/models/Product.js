const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String },
    serialNumber: { type: String, unique: true },
    description: { type: String },
    quantityInStock: { type: Number, required: true },
    price: { type: Number, required: true },
    salesPrice: { type: Number, default: 0 }, // New attribute for discounted price
    warrantyStatus: { type: Boolean },
    distributor: { type: String },
    popularity: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }, // Total sum of ratings
    numberOfRatings: { type: Number, default: 0 }, // Number of ratings
    category: { type: String },
    gender: { type: String, enum: ['Women', 'Men', 'Unisex'] },
    brand: { type: String },
    image: { type: String },
});

module.exports = mongoose.model('Product', productSchema);
