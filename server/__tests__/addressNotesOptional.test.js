const Address = require('../models/Address');

describe('Address Model - Optional Notes', () => {
  it('should save the address even when notes are not provided', async () => {
    const address = await Address.create({
      userId: 'user123',
      address: '123 Test Street',
      city: 'Test City',
      pincode: '123456',
      phone: '9876543210',
    });

    expect(address.notes).toBeUndefined();
  });
});
