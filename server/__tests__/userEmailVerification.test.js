const User = require('../models/User');

describe('User Model - Invalid Email Validation', () => {
  it('should throw a validation error for invalid email format', async () => {
    try {
      await User.create({
        userName: 'invalidEmailUser',
        email: 'invalid-email',
        password: 'securepassword',
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    }
  });
});
