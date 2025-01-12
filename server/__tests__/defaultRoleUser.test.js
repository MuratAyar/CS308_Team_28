const User = require('../models/User');

describe('User Model - Default Role Assignment', () => {
  it('should assign the default role as "user" if no role is provided', async () => {
    const user = await User.create({
      userName: 'defaultRole',
      email: 'default@role.com',
      password: 'securepassword123',
    });

    expect(user.role).toBe('user');
  });
});
