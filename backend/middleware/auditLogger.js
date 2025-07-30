const AuditLog = require('../model/auditLog');

// Helper function to get client IP
const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.ip;
};

// Middleware to log user activities
const logActivity = (action, details = {}) => {
    return (req, res, next) => {
        try {
            // Store original send function
            const originalSend = res.send;
            
            // Override send function to capture response
            res.send = function(data) {
                // Restore original send
                res.send = originalSend;
                
                // Log the activity after response is sent
                if (req.user) {
                    const auditEntry = new AuditLog({
                        userId: req.user._id,
                        userEmail: req.user.email,
                        userName: `${req.user.first_name} ${req.user.last_name}`,
                        action: action,
                        details: {
                            address: req.user.address,
                            country: req.user.country,
                            region_state: req.user.region_state,
                            phone: req.user.phone,
                            // ...details,
                            // endpoint: req.originalUrl,
                            // method: req.method,
                            // statusCode: res.statusCode
                        },
                        ipAddress: getClientIP(req),
                        userAgent: req.headers['user-agent']
                    });
                    
                    auditEntry.save().catch(err => {
                        console.error('Error saving audit log:', err);
                    });
                }
                
                // Call original send
                return originalSend.call(this, data);
            };
            
            next();
        } catch (error) {
            console.error('Error in audit logger middleware:', error);
            next();
        }
    };
};

// Specific middleware for login
const logLogin = logActivity('LOGIN', { type: 'user_login' });

// Specific middleware for logout
const logLogout = logActivity('LOGOUT', { type: 'user_logout' });

// Specific middleware for cart operations
const logCartOperation = (operation) => {
    return logActivity(operation, { type: 'cart_operation' });
};

// Specific middleware for order placement
const logOrderPlacement = logActivity('PLACE_ORDER', { type: 'order_placement' });

module.exports = {
    logActivity,
    logLogin,
    logLogout,
    logCartOperation,
    logOrderPlacement,
    getClientIP
}; 