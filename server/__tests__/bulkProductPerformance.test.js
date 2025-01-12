const Product = require('../models/Product');

describe('Product Model - Performance Test', () => {
  it('should create and fetch at least 1000 products successfully', async () => {
    const bulkProducts = Array.from({ length: 1000 }, (_, i) => ({
      name: `Product ${i + 1}`,
      price: Math.floor(Math.random() * 100),
      quantityInStock: Math.floor(Math.random() * 50) + 1,
    }));

    const start = Date.now();
    await Product.insertMany(bulkProducts);
    const products = await Product.find();
    const end = Date.now();

    // Check data integrity
    expect(products.length).toBeGreaterThanOrEqual(1000);

    // Adjust timing to allow for slight delays
    expect(end - start).toBeLessThanOrEqual(2000); // Allow up to 2000ms
  });
});
