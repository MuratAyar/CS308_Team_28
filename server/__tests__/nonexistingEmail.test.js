const mongoose = require('mongoose');
const { registerUser } = require('../controllers/auth/auth-controller');

describe('Invalid Email Format Validation', () => {
  

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should fail if email format is invalid', async () => {
    const req = {
      body: {
        userName: 'Test User',
        email: 'invalid-email',
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
        message:  "User registered, but email failed to send.",
      })
    );
  });
});
