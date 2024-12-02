const mongoose = require('mongoose');
const { registerUser } = require('../controllers/auth/auth-controller');
const User = require('../models/User');

describe('Valid User Registration', () => {
 

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should successfully register a valid user', async () => {
    const req = {
      body: {
        userName: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true
        
      })
    );
  });
});
