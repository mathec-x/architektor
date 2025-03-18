import app from './infrastructure/config/app';
import request from 'supertest';

describe('GET /', () => {
  it('should responds with json message', async () => {
    const response = await request(app).get('/').expect(200);
    expect(response.body.message).toBe('Hello World');
  });
});
