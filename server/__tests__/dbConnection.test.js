const Product = require('../models/Product');

it('should create and fetch a product correctly', async () => {
  const productData = {
    name: 'Product A',
    title: 'Title A',
    price: 100,
    quantityInStock: 50
  };

  // Create product
  const createdProduct = await Product.create(productData);
  expect(createdProduct).toBeDefined();
  expect(createdProduct._id).toBeDefined();
  expect(createdProduct.name).toBe(productData.name);

  // Fetch product from DB
  const fetchedProduct = await Product.findById(createdProduct._id);
  expect(fetchedProduct).toBeDefined();
  expect(fetchedProduct.name).toBe(productData.name);
});
