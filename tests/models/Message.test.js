const mongoose = require('mongoose');
const Message = require('../../models/Message');

describe('Message Model Test', () => {
  const validMessageData = {
    conversationId: '123456789',
    text: 'Hello, this is a test message',
    sender: 'user',
    senderId: new mongoose.Types.ObjectId(),
    receiverId: new mongoose.Types.ObjectId(),
    time: '12:00 PM',
  };

  it('should create & save message successfully', async () => {
    const validMessage = new Message(validMessageData);
    const savedMessage = await validMessage.save();
    
    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.conversationId).toBe(validMessageData.conversationId);
    expect(savedMessage.text).toBe(validMessageData.text);
    expect(savedMessage.status).toBe('sent'); // default value
  });

  it('should fail to save with invalid sender type', async () => {
    const messageWithInvalidSender = new Message({
      ...validMessageData,
      sender: 'invalid',
    });

    let err;
    try {
      await messageWithInvalidSender.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save without required fields', async () => {
    const messageWithoutRequired = new Message({});
    let err;
    
    try {
      await messageWithoutRequired.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});