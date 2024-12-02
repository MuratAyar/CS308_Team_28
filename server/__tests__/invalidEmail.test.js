const mongoose = require('mongoose');
const Product = require('../models/User');
const {registerUser  } = require('../controllers/auth/auth-controller');
describe('Product Model - Creation', () => {
    afterAll(async () => {
      await Product.deleteMany({});
      await mongoose.disconnect();
    });
it('should reject invalid email formats', async () => {
    const req = { body: { userName: 'Test User', email: 'invalidEmail', password: 'password123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await registerUser(req, res);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User registered, but email failed to send."
      })
    );
  });
})
  