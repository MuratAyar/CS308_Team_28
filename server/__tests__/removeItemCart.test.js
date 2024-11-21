const mongoose = require('mongoose');
const Cart = require('../models/Cart');  // Adjust the path as needed
const User = require('../models/User');  // Adjust the path as needed
const Product = require('../models/Product');  // Adjust the path as needed


it('should remove an item from the cart', async () => {
    const user = await User.create({
      userName: 'emily_clark',
      email: 'emily.clark@example.com',
      password: 'password321',
      role: 'user'
    });
  
    const product = await Product.create({
      name: 'Product 1', 
      title: 'Test Product 1',
      price: '200',
      quantityInStock: 50
    });
  
    const cart = await Cart.create({
      userId: user._id,
      items: [{ productId: product._id, quantity: 3 }]
    });
  
    // Remove item
    cart.items = cart.items.filter(item => item.productId.toString() !== product._id.toString());
    await cart.save();
  
    const updatedCart = await Cart.findById(cart._id);
    expect(updatedCart.items.length).toBe(0);
  });
  