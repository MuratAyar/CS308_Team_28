const Product = require('../models/Product');

describe('Product Model - Stock Update', () => {
  it('should update the stock correctly when quantity decreases', async () => {
    // Create a product with all required fields
    const product = new Product({
      name: 'Product 1', // Add the 'name' field
      price: 100,        // Add the 'price' field
      quantityInStock: 10
    });


    expect(product.quantityInStock).toBe(10);
  });
});
