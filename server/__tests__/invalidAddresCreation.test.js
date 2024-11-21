const mongoose = require('mongoose');
const Address = require('../models/Address');
describe('Address Model - Unit Tests', () => {
    afterAll(async () => {
        await mongoose.connection.dropDatabase(); // Clean up the test database
        await mongoose.disconnect();
      });
      it('should throw a validation error if required fields are missing', async () => {
        try {
          await Address.create({
            userId: '12345',
            city: 'Metropolis',
          });
        } catch (err) {
          expect(err).toBeDefined();
          expect(err.errors.address).toBeDefined();
          expect(err.errors.pincode).toBeDefined();
          expect(err.errors.phone).toBeDefined();
        }
      });
    
      it('should reject invalid pincode formats', async () => {
        try {
          await Address.create({
            userId: '12345',
            address: '123 Elm Street',
            city: 'Metropolis',
            pincode: 'abc123', // Invalid pincode
            phone: '9876543210',
            notes: 'Leave at the front door',
          });
        } catch (err) {
          expect(err).toBeDefined();
          expect(err.errors.pincode).toBeDefined(); // pincode validation error
        }
      });
    
      it('should create an address with optional notes omitted', async () => {
        const address = await Address.create({
          userId: '54321',
          address: '789 Oak Avenue',
          city: 'Gotham',
          pincode: '654321',
          phone: '1234567890',
        });
    
        expect(address.userId).toBe('54321');
        expect(address.notes).toBeUndefined();
      });

})