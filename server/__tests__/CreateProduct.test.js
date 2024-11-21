const mongoose = require('mongoose');
const Product = require('../models/Product');  // Adjust the path as needed

describe('Product Model - Creation', () => {
  afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.disconnect();
  });

  it('should create a product with valid details', async () => {
    const product = await Product.create({
      name: 'Product 1', // Add the 'name' field
      price: 100,        // Add the 'price' field
      quantityInStock: 10
    });
    await product.save();
    expect(product.name).toBe('Product 1');
    expect(product.price).toBe(100);
    expect(product.quantityInStock).toBe(10);
  });




});
