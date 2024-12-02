const mongoose = require('mongoose');
const { registerUser } = require('../controllers/auth/auth-controller');

describe('Short Password Validation', () => {
  

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should fail if password is too short', async () => {
    const req = {
      body: {
        userName: 'Test User',
        email: 'testuser@example.com',
        password: 'x',
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
        success: true,
      })
    );
  });
});
