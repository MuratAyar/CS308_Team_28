const mongoose = require('mongoose');
const Cart = require('../models/Cart');  // Adjust the path as needed
const User = require('../models/User');  // Adjust the path as needed
const Product = require('../models/Product');  // Adjust the path as needed

describe('Cart Model - Creation', () => {
  let user;
  let product;

  beforeAll(async () => {
    // Create a dummy user and product to associate with the cart
    user = await User.create({
      userName: 'john_doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'user'
    });
    user.save()

    product = await Product.create({
      name: 'Product 1', 
      title: 'Test Product',
      price: '100',
      quantityInStock: 50
    });
    product.save()
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await mongoose.disconnect();
  });

  it('should create a cart and associate it with a user and product', async () => {
    const cart = await Cart.create({
      userId: user._id,
      items: [{
        productId: product._id,
        quantity: 2
      }]
    });
    cart.save()

    expect(cart.userId.toString()).toBe(user._id.toString());
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].productId.toString()).toBe(product._id.toString());
    expect(cart.items[0].quantity).toBe(2);
  });
});