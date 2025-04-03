const request = require('supertest');
const app = require('../../server'); // Adjust the path to your Express app

describe('API Routes Test', () => {
  it('should respond with a 200 status for the root route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Welcome to the API');
  });

 
});