const mongoose = require('mongoose');
const Order = require('../models/Order');

describe('Order Model - Invalid Status Validation', () => {

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should throw a validation error for an invalid order status', async () => {
    try {
      await Order.create({
        userId: new mongoose.Types.ObjectId(),
        cartItems: [{ productId: new mongoose.Types.ObjectId(), quantity: 1 }],
        orderStatus: 'invalid-status',
        totalAmount: 100,
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toMatch(/validation failed/i);
      expect(error.message).toContain('orderStatus');
    }
  });
});
