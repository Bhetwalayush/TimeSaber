// // __tests__/app.test.js
// const request = require('supertest');
// const app = require('../index.js'); // Path to your server file

// let token; // Variable to store the token

// beforeAll(async () => {
//   // Get token by logging in an existing user or creating a mock one
//   const loginRes = await request(app)
//     .post('/api/creads/login') // Update with your actual login route
//     .send({
//       email: 'vitalflow@gmail.com', // Replace with valid credentials
//       password: 'vital123', // Replace with valid credentials
//     });

//   token = loginRes.body.token; // Save the token from the response
// }); 

// describe('API Routes', () => {
//   it('should get all items from /api/items', async () => {
//     const res = await request(app)
//       .get('/api/items')
//       .set('Authorization', `Bearer ${token}`); // Add the token to the Authorization header

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('should add a new item to /api/items', async () => {
//     const newItem = {
//       name: 'Test Item',
//       price: 100,
//       description: 'This is a test item',
//     };

//     const res = await request(app)
//       .post('/api/items')
//       .set('Authorization', `Bearer ${token}`) // Use token for authorization
//       .send(newItem);

//     expect(res.status).toBe(201);
//     expect(res.body.name).toBe(newItem.name);
//   });

//   it('should get a cart from /api/cart', async () => {
//     const res = await request(app)
//       .get('/api/cart')
//       .set('Authorization', `Bearer ${token}`);

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('should post an order to /api/order', async () => {
//     const order = {
//       itemId: '12345',
//       quantity: 2,
//       userId: 'userId',
//     };

//     const res = await request(app)
//       .post('/api/order')
//       .set('Authorization', `Bearer ${token}`)
//       .send(order);

//     expect(res.status).toBe(201);
//     expect(res.body.itemId).toBe(order.itemId);
//   });

//   it('should get admin dashboard from /api/admin', async () => {
//     const res = await request(app)
//       .get('/api/admin/dashboard')
//       .set('Authorization', `Bearer ${token}`); // Ensure token is provided for admin routes

//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty('stats');
//   });
// });
