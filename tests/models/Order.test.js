const mongoose = require('mongoose');
const Order = require('../../models/Order');

describe('Order Model Test', () => {
  const validOrderData = {
    userId: new mongoose.Types.ObjectId(),
    products: [
      { productId: new mongoose.Types.ObjectId(), quantity: 2 },
      { productId: new mongoose.Types.ObjectId(), quantity: 1 },
    ],
    total: 59.98,
  };

  it('should create & save order successfully', async () => {
    const validOrder = new Order(validOrderData);
    const savedOrder = await validOrder.save();
    
    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.userId).toBe(validOrderData.userId);
    expect(savedOrder.total).toBe(validOrderData.total);
  });

  it('should fail to save order without required fields', async () => {
    const orderWithoutRequired = new Order({});
    let err;
    
    try {
      await orderWithoutRequired.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});