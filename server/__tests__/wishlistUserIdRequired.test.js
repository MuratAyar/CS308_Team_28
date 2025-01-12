const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');

describe('Wishlist Model - User ID Validation', () => {

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should throw a validation error if userId is missing', async () => {
    try {
      await Wishlist.create({
        items: [{ productId: new mongoose.Types.ObjectId() }],
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toMatch(/validation failed/i);
      expect(error.message).toContain('userId');
    }
  });
});
