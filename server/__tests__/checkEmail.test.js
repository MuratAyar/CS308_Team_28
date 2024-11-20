const User = require('../models/User');

describe('User Model', () => {

  
  it('should throw error if email is not unique', async () => {
    

    const user2 = new User({
      userName: 'bob',
      email: 'alice@example.com',
      password: 'password456'
    });
    
    try {
      await user2.save();
    } catch (error) {
      expect(error.message).toContain('duplicate key error');
    }
  });
});
