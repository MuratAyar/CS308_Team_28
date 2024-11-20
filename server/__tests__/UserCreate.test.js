const User = require('../models/User');

describe('User Model', () => {
  it('should create a user successfully with valid data', async () => {
    const newUser = new User({
      userName: 'john_doe',
      email: 'john.doe@example.com',
      password: 'password123'
    });
    
    await newUser.save();
    
    expect(newUser.userName).toBe('john_doe');
    expect(newUser.email).toBe('john.doe@example.com');
    expect(newUser.password).toBe('password123');
    expect(newUser.role).toBe('user');
  });
  
  ;
});
