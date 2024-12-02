const mongoose = require('mongoose');
const { registerUser } = require('../controllers/auth/auth-controller');

describe('Missing Email Field', () => {
  

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should fail if email is missing', async () => {
    const req = {
      body: {
        userName: 'Test User',
        password: 'password123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });
});
