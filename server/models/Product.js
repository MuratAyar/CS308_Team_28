const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String },
    serialNumber: { type: String, unique: true },
    description: { type: String },
    quantityInStock: { type: Number, required: true },
    price: { type: Number, required: true },
    warrantyStatus: { type: Boolean },
    distributor: { type: String },
    popularity: { type: Number, default: 0 },
    rating: { type: Number },
    category: { type: String },
    gender: { type: String, enum: ['male', 'female', 'unisex'] },
    brand: { type: String },
    image: { type : String }
  });
module.exports = mongoose.model('Product', productSchema);
