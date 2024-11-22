const mongoose = require('mongoose');
const {registerUser  } = require('../controllers/auth/auth-controller');
const User = require('../models/User');

describe('User Service', () => {
  
      
      afterAll(async () => {
        try {
          await mongoose.connection.dropDatabase();
          await mongoose.connection.close();
        } catch (err) {
          console.error('Error during cleanup:', err);
        }
      });
      const userData = {
        userName: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      };
      
      let createdUserId;
      it('should create a new user successfully', async () => {
        const req = { body: userData };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        await registerUser(req, res);
      
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "User registered, but email failed to send.",
            "success": true
          })
        );
      
        const createdUser = await User.findOne({ email: userData.email });
        expect(createdUser).not.toBeNull();
        expect(createdUser.name).toBe(userData.name);
        expect(createdUser.email).toBe(userData.email);
      
        createdUserId = createdUser._id;  // Save user ID for later tests
      });
            
      
});
