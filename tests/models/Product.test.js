const mongoose = require('mongoose');
const Product = require('../../models/Product');

describe('Product Model Test', () => {
  const validProductData = {
    name: 'Test Product',
    price: 29.99,
    stock: 100,
  };

  it('should create & save product successfully', async () => {
    const validProduct = new Product(validProductData);
    const savedProduct = await validProduct.save();
    
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(validProductData.name);
    expect(savedProduct.price).toBe(validProductData.price);
  });

  it('should fail to save product without required fields', async () => {
    const productWithoutRequired = new Product({});
    let err;
    
    try {
      await productWithoutRequired.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});