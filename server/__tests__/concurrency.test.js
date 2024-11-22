const mongoose = require('mongoose');
const Product = require('../models/Product');  // Adjust the path as needed

describe('Concurrency Tests', () => {
  let product;  // Declare product variable at the top level

  // Setup: Create a product before the test runs
  beforeAll(async () => {
    product = await Product.create({
      name: 'Race Condition Product',
      title: 'Test Title',
      price: 100,
      quantityInStock: 50
    });
  });

  // Test case to handle concurrent updates
  it('should handle concurrent updates to the same product', async () => {
    // Simulate two concurrent updates
    const updateProduct = async (newPrice) => {
      const productToUpdate = await Product.findById(product._id);
      productToUpdate.price = newPrice;
      await productToUpdate.save();
    };

    const update1 = updateProduct(120);
    const update2 = updateProduct(130);

    await Promise.all([update1, update2]);

    // Fetch the updated product
    const updatedProduct = await Product.findById(product._id);
    expect([120, 130]).toContain(updatedProduct.price);  // One of the two prices should be reflected
  });
});
