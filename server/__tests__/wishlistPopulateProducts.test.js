const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

describe('Wishlist Model - Populated Product Fields', () => {

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should populate product details in the wishlist', async () => {
    const product = await Product.create({
      name: 'Test Product',
      price: 50,
      quantityInStock: 10,
    });

    const wishlist = await Wishlist.create({
      userId: new mongoose.Types.ObjectId(),
      items: [{ productId: product._id }],
    });

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('items.productId');
    expect(populatedWishlist.items[0].productId.name).toBe('Test Product');
  });
});
