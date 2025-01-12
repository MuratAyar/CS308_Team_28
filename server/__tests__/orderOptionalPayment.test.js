const mongoose = require('mongoose');
const Order = require('../models/Order');

describe('Order Model - Optional Payment Details', () => {

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should create an order successfully without payment details', async () => {
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(),
      cartItems: [{ productId: new mongoose.Types.ObjectId(), quantity: 2 }],
      totalAmount: 200,
      orderStatus: 'processing',
    });

    expect(order.paymentMethod).toBeUndefined();
    expect(order.cardNumber).toBeUndefined();
  });
});
