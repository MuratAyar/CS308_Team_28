const mongoose = require('mongoose');
const { addProduct } = require('../controllers/product/product-controller'); // Adjust path as needed

// Mock Product model (you may adjust this if needed)
const Product = require('../models/Product');

describe('Product Service', () => {
  // Sample product data
  const productData = { 
    name: 'Test Product', 
    title: 'Sample Product', 
    price: 150, 
    quantityInStock: 20 
  };



  // Cleanup database and close connection after tests
  afterAll(async () => {
    try {
      await mongoose.connection.dropDatabase(); // Clean test database
      await mongoose.connection.close();       // Close database connection
    } catch (err) {
      console.error('Error during cleanup:', err);
    }
  });

  it('should create a new product successfully', async () => {
    // Mock request and response objects
    const req = { body: productData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the addProduct function
    await addProduct(req, res);

    // Validate the response
    expect(res.status).toHaveBeenCalledWith(201); // Ensure 200 status is returned
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        
        message: "Product added successfully",
        
      })
    );


  });
});
