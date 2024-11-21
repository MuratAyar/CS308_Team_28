const mongoose = require('mongoose');
const Order = require('../models/Order');  // Adjust the path as needed
const Cart = require('../models/Cart');  // Adjust the path as needed
const User = require('../models/User');  // Adjust the path as needed

describe('Order Model - Creation', () => {
  let user;
  let cart;

  beforeAll(async () => {
    // Create a dummy user and cart to associate with the order
    user = await User.create({
      userName: 'jane_doe',
      email: 'jane.doe@example.com',
      password: 'password123',
      role: 'user'
    });
    await user.save()
    cart = await Cart.create({
      userId: user._id,
      items: [{
        productId: new mongoose.Types.ObjectId(),  // Use 'new' here
        quantity: 2
      }]
    });
    cart.save()
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await mongoose.disconnect();
  });

  it('should create an order and associate it with the cart and user', async () => {
    const order = await Order.create({
      userId: user._id,
      cartItems: cart.items,
      orderStatus: 'processing',
      paymentMethod: 'credit card',
      totalAmount: 200,
      orderDate: new Date(),
      paymentStatus: 'pending'
    });
    order.save()

    expect(order.userId.toString()).toBe(user._id.toString());
    expect(order.cartItems.length).toBe(cart.items.length);
    expect(order.orderStatus).toBe('processing');
    expect(order.paymentStatus).toBe('pending');
    expect(order.totalAmount).toBe(200);
  });
});