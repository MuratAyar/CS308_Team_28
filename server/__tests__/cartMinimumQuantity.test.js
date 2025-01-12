const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

describe('Cart Model - Zero Quantity Prevention', () => {

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should not add items with a quantity of 0 to the cart', async () => {
    const product = await Product.create({
      name: 'Test Product',
      price: 50,
      quantityInStock: 10,
    });

    try {
      await Cart.create({
        userId: new mongoose.Types.ObjectId(),
        items: [{ productId: product._id, quantity: 0 }],
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toContain('quantity');
    }
  });
});
