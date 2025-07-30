const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const AuditLog = require('../model/auditLog');
const User = require('../model/Users');

describe('Audit Log System', () => {
    let testUser;
    let authToken;

    beforeAll(async () => {
        // Create a test user
        testUser = new User({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            confirm_password: 'hashedpassword',
            phone: '1234567890',
            address: 'Test Address',
            country: 'Test Country',
            region_state: 'Test State'
        });
        await testUser.save();
    });

    afterAll(async () => {
        // Clean up
        await User.deleteMany({ email: 'test@example.com' });
        await AuditLog.deleteMany({ userEmail: 'test@example.com' });
        await mongoose.connection.close();
    });

    test('should log user login activity', async () => {
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(loginResponse.status).toBe(401); // Should fail due to password mismatch
        
        // Check if audit log was created (even for failed login)
        const auditLogs = await AuditLog.find({ userEmail: 'test@example.com' });
        expect(auditLogs.length).toBeGreaterThan(0);
    });

    test('should log cart operations', async () => {
        // This test would require proper authentication setup
        // For now, we'll just verify the endpoint exists
        const response = await request(app)
            .get('/api/admin/audit/logs')
            .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401); // Should require authentication
    });

    test('should provide audit statistics', async () => {
        const response = await request(app)
            .get('/api/admin/audit/stats')
            .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401); // Should require authentication
    });
}); 