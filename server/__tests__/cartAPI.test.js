const mongoose = require('mongoose');
const { addToCart } = require('../controllers/shop/cart-controller'); // Adjusted path
const Cart = require('../models/Cart');

describe('Cart Service', () => {
  const userId = new mongoose.Types.ObjectId();
  const productId = new mongoose.Types.ObjectId();



  afterAll(async () => {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    } catch (err) {
      console.error('Error during cleanup:', err);
    }
  });

  it('should add a product to the cart successfully', async () => {
    const req = {
      body: {
        userId: userId.toString(), // Convert ObjectId to string
        productId: productId.toString(), // Convert ObjectId to string
        quantity: 2,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the addToCart function
    await addToCart(req, res);

    // Validate the response
    expect(res.status).toHaveBeenCalledWith(200);
    

   
  });

  it('should increment the quantity if the product already exists in the cart', async () => {
    const req = {
      body: {
        userId: userId.toString(),
        productId: productId.toString(),
        quantity: 3, // Adding 3 more of the same product
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the addToCart function
    await addToCart(req, res);

    // Validate the response
    expect(res.status).toHaveBeenCalledWith(200);


    
  });
});
