const Order = require('../../server/models/Order')

describe('Order Model', () => {
  it('should create an order with default status as "processing"', () => {
    const newOrder = new Order({
      userId: '12345',
      cartItems: [
        { productId: 'p1', title: 'Product 1', quantity: 2, price: '100' }
      ],
      addressInfo: { address: '123 Street', city: 'City', pincode: '12345' },
      paymentMethod: 'credit card',
      totalAmount: 200
    });

    expect(newOrder.orderStatus).toBe('processing');
  });
});
