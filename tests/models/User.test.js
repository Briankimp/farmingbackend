const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model Test', () => {
  const validUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  it('should create & save user successfully', async () => {
    const validUser = new User(validUserData);
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUserData.username);
    expect(savedUser.email).toBe(validUserData.email);
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequired = new User({});
    let err;
    
    try {
      await userWithoutRequired.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save user with invalid email', async () => {
    const userWithInvalidEmail = new User({
      ...validUserData,
      email: 'invalid-email',
    });

    let err;
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});