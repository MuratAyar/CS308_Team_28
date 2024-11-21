const mongoose = require('mongoose');
const Product = require('../models/Product');

// Connect to the database before all tests
beforeAll(async () => {
  

  // Seed the database with test products
  await Product.create([
    { name: 'Product 1', title: 'Test Product 1', price: 100, quantityInStock: 50 },
    { name: 'Product 2', title: 'Test Product 2', price: 150, quantityInStock: 30 },
    { name: 'Product 3', title: 'Test Product 3', price: 200, quantityInStock: 20 },
  ]);
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Performance Tests', () => {
  it('should fetch products in under 200ms', async () => {
    const start = Date.now();

    const products = await Product.find();

    const end = Date.now();
    console.log(`Time taken to fetch products: ${end - start}ms`);
    expect(end - start).toBeLessThan(200);  // Ensure it fetches in under 200ms
  });
});
