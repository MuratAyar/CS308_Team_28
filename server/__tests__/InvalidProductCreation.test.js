const mongoose = require('mongoose');
const Product = require('../models/Product');  // Adjust the path as needed

describe('Product Model - Creation', () => {
  afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.disconnect();
  });




  it('should throw an error if the product title is missing', async () => {
    try {
      await Product.create({
        price: '199.99',
        quantityInStock: 100
      });
      
    } catch (err) {
      expect(err.errors.name).toBeDefined();
    }
  });

});
