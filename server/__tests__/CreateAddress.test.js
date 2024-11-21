const mongoose = require('mongoose');
const Address = require('../models/Address'); // Adjust the path as needed

describe('Address Model - Creation', () => {
  afterAll(async () => {
    await Address.deleteMany({});
    await mongoose.disconnect();
  });

  it('should create an address with valid details', async () => {
    const address = await Address.create({
      userId: '12345',
      address: '123 Elm Street',
      city: 'Metropolis',
      pincode: '123456',
      phone: '9876543210',
      notes: 'Leave at the front door'
    });

    await address.save();

    expect(address.userId).toBe('12345');
    expect(address.address).toBe('123 Elm Street');
    expect(address.city).toBe('Metropolis');
    expect(address.pincode).toBe('123456');
    expect(address.phone).toBe('9876543210');
    expect(address.notes).toBe('Leave at the front door');
  });
});
