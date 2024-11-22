const mongoose = require('mongoose');
const Cart = require('../models/Cart');  // Adjust the path as needed
const User = require('../models/User');  // Adjust the path as needed
const Product = require('../models/Product');  // Adjust the path as needed
it('should throw an error if quantity is negative', async () => {
    const user = await User.create({
      userName: 'kevin_black',
      email: 'kevin.black@example.com',
      password: 'password202',
      role: 'user'
    });
  
    const product = await Product.create({
      name: 'Product 1', 
      title: 'Test Product 1',
      price: '80',
      quantityInStock: 10
    });
  
    try {
      const cart = await Cart.create({
        userId: user._id,
        items: [{ productId: product._id, quantity: -2 }]
      });
      await cart.save();
    } catch (error) {
      console.log(error); // Log the error to see the full structure
      expect(error).toBeDefined();
      // You can adjust the following part depending on the actual structure of the error
      expect(error.errors['items.0.quantity']).toBeDefined();
      expect(error.errors['items.0.quantity'].message).toBeDefined();
    }
  });
  