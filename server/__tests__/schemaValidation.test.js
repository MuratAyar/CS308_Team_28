const mongoose = require('mongoose');
const User = require('../models/User');

describe('Required Fields Validation', () => {
  

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should fail if required fields are missing', async () => {
    const invalidUser = new User({
      // Missing userName, email, and password
    });

    await expect(invalidUser.save()).rejects.toThrow(/User validation failed/);
  });
});
