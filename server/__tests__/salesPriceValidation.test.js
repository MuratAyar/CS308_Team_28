const Product = require('../models/Product');

describe('Product Model - Sales Price Validation', () => {
  it('should throw an error if salesPrice exceeds the regular price', async () => {
    try {
      await Product.create({
        name: 'Invalid Sale Product',
        price: 50,
        salesPrice: 100,
        quantityInStock: 10,
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.errors.salesPrice).toBeDefined();
    }
  });
});
