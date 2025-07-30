# Audit Log System Documentation

## Overview
The audit log system tracks user activities across the TimeSaber application, providing administrators with comprehensive visibility into user behavior, login/logout events, and cart operations.

## Features

### Tracked Activities
- **User Login/Logout**: All authentication events
- **Cart Operations**: Add to cart, remove from cart, update quantities
- **Order Placement**: When users place orders
- **Item Views**: When users view product details
- **Search Activities**: User search queries

### Admin Panel Features
- **Real-time Activity Dashboard**: View recent user activities
- **Filtered Logs**: Filter by user, action type, date range
- **User-specific Logs**: View activity history for specific users
- **Export Functionality**: Export logs to CSV format
- **Statistics**: Activity summaries and trends

## API Endpoints

### Admin Audit Log Endpoints
All endpoints require admin authentication.

#### Get Audit Logs
```
GET /api/admin/audit/logs
```
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `userId`: Filter by specific user ID
- `action`: Filter by action type (LOGIN, LOGOUT, ADD_TO_CART, etc.)
- `userEmail`: Filter by user email (partial match)
- `startDate`: Start date for date range filter
- `endDate`: End date for date range filter

#### Get Audit Statistics
```
GET /api/admin/audit/stats
```
Returns activity statistics including:
- Time-based stats (today, this week, this month, total)
- Action-wise statistics
- Top active users

#### Get User-specific Logs
```
GET /api/admin/audit/user/:userId
```
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

#### Export Audit Logs
```
GET /api/admin/audit/export
```
**Query Parameters:**
- `startDate`: Start date for export
- `endDate`: End date for export

Returns CSV file with audit log data.

## Database Schema

### AuditLog Model
```javascript
{
  userId: ObjectId,        // Reference to user
  userEmail: String,       // User's email
  userName: String,        // User's full name
  action: String,          // Action type (LOGIN, LOGOUT, etc.)
  details: Mixed,          // Additional details about the action
  ipAddress: String,       // Client IP address
  userAgent: String,       // Browser/device information
  timestamp: Date          // When the action occurred
}
```

## Implementation Details

### Middleware Integration
The audit system uses middleware to automatically log activities:

1. **Authentication Events**: Login/logout are logged via middleware
2. **Cart Operations**: Add/remove/update cart items are tracked
3. **Order Events**: Order placement is logged

### Performance Considerations
- Database indexes on frequently queried fields
- Pagination for large datasets
- Efficient filtering and aggregation queries

## Security Features
- Admin-only access to audit logs
- IP address tracking for security monitoring
- User agent logging for device identification
- Comprehensive activity trail for compliance

## Usage Examples

### Frontend Integration
```javascript
// Fetch audit logs with filtering
const response = await fetch('/api/admin/audit/logs?page=1&limit=20&action=LOGIN', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

// Get audit statistics
const stats = await fetch('/api/admin/audit/stats', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

// Export logs
const exportResponse = await fetch('/api/admin/audit/export?startDate=2024-01-01&endDate=2024-01-31', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

## Monitoring and Maintenance
- Regular cleanup of old audit logs (recommended: keep for 1 year)
- Monitor database size and performance
- Set up alerts for unusual activity patterns
- Regular backup of audit log data

## Future Enhancements
- Real-time notifications for suspicious activities
- Advanced analytics and reporting
- Integration with external security tools
- Automated anomaly detection 