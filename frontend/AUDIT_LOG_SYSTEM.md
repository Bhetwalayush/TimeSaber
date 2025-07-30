# TimeSaber Audit Log System

## Overview

The TimeSaber Audit Log System provides comprehensive monitoring and tracking of user activities across the application. This system automatically captures user actions, provides detailed analytics, and offers export capabilities for compliance and security purposes.

## Features

### 🔍 **Activity Tracking**
- **Login/Logout Events**: Track user authentication activities
- **Cart Operations**: Monitor add, remove, and update cart actions
- **User Details**: Capture user ID, name, and IP address
- **Timestamps**: Precise timing for all activities
- **IP Address Tracking**: Monitor user access locations

### 📊 **Analytics Dashboard**
- **Real-time Statistics**: Live activity counters and metrics
- **Action Distribution**: Visual breakdown of activity types
- **Hourly Patterns**: Activity trends throughout the day
- **User Rankings**: Most active users and their statistics
- **Recent Activity Feed**: Latest actions across the system

### 🔧 **Admin Tools**
- **Advanced Filtering**: Filter by user, action type, date range
- **Search Functionality**: Full-text search across audit logs
- **Export Capabilities**: CSV export for compliance reporting
- **User Activity Timeline**: Detailed view of individual user actions
- **Pagination**: Efficient handling of large datasets

## Frontend Components

### 1. **AuditLogs Component** (`/auditlogs`)
- **Location**: `src/core/private/audit logs/auditlogs.jsx`
- **Features**:
  - Comprehensive audit log table with filtering
  - Real-time statistics cards
  - Advanced search and filter options
  - Export functionality
  - Pagination support
  - User activity navigation

### 2. **AuditStats Component** (`/auditstats`)
- **Location**: `src/core/private/audit logs/auditstats.jsx`
- **Features**:
  - Interactive charts using Recharts
  - Action type distribution (Pie Chart)
  - Hourly activity patterns (Line Chart)
  - User activity rankings (Bar Chart)
  - Time range selection (7d, 30d, 90d)
  - Export capabilities

### 3. **UserActivity Component** (`/useractivity/:userId`)
- **Location**: `src/core/private/audit logs/useractivity.jsx`
- **Features**:
  - Individual user activity timeline
  - User information display
  - Activity statistics
  - Visual timeline with action indicators
  - Export user-specific data

## API Endpoints

The frontend integrates with the following backend API endpoints:

### 1. **Get Audit Logs**
```
GET /api/admin/audit/logs
```
- **Query Parameters**:
  - `page`: Page number for pagination
  - `limit`: Items per page
  - `userId`: Filter by specific user
  - `actionType`: Filter by action type
  - `startDate`: Start date filter
  - `endDate`: End date filter
  - `search`: Text search

### 2. **Get Audit Statistics**
```
GET /api/admin/audit/stats
```
- **Query Parameters**:
  - `timeRange`: Time range (7d, 30d, 90d)

### 3. **Get User Activity**
```
GET /api/admin/audit/user/:userId
```
- **Response**: User-specific activity data and statistics

### 4. **Export Audit Logs**
```
GET /api/admin/audit/export
```
- **Response**: CSV file download

## Navigation Integration

### Sidebar Menu
The audit log system is integrated into the admin sidebar with the following structure:

```
Audit Logs (Security Icon)
├── All Logs (Assessment Icon) → /auditlogs
└── Statistics (BarChart Icon) → /auditstats
```

### Routes
- `/auditlogs` - Main audit logs dashboard
- `/auditstats` - Analytics and statistics
- `/useractivity/:userId` - Individual user activity timeline

## Security Features

### 🔐 **Authentication**
- Admin-only access control
- JWT token validation
- Role-based permissions

### 🛡️ **Data Protection**
- Secure API endpoints
- Input validation and sanitization
- Rate limiting support

## Usage Instructions

### For Administrators

1. **Accessing Audit Logs**:
   - Navigate to the admin panel
   - Click on "Audit Logs" in the sidebar
   - Select "All Logs" for the main dashboard

2. **Filtering and Searching**:
   - Use the filter panel to narrow down results
   - Enter user ID, select action type, or set date ranges
   - Use the search box for text-based filtering

3. **Viewing User Activity**:
   - Click "View Activity →" next to any user in the logs table
   - This opens a detailed timeline for that specific user

4. **Exporting Data**:
   - Click the "Export" button to download CSV files
   - Available for both general logs and user-specific data

5. **Viewing Statistics**:
   - Navigate to "Audit Logs" → "Statistics"
   - Select time range (7 days, 30 days, or 90 days)
   - View interactive charts and analytics

### Data Interpretation

#### Action Types
- **login**: User authentication events
- **logout**: User logout events
- **add_to_cart**: Items added to shopping cart
- **remove_from_cart**: Items removed from cart
- **update_cart**: Cart quantity updates

#### Statistics Metrics
- **Total Logs**: Complete count of all audit entries
- **Today's Logs**: Activity count for the current day
- **Unique Users**: Number of distinct users with activity
- **Top Actions**: Most frequently performed actions

## Technical Implementation

### Dependencies
- **React**: Core framework
- **Recharts**: Chart visualization library
- **Material-UI Icons**: Icon components
- **React Router**: Navigation
- **React Toastify**: Notifications

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-friendly layouts
- **Modern UI**: Clean, professional interface

### State Management
- **React Hooks**: Local state management
- **useEffect**: Data fetching and side effects
- **useState**: Component state

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: Machine learning insights
- **Alert System**: Automated notifications for suspicious activity
- **Data Retention**: Configurable log retention policies
- **API Rate Limiting**: Enhanced security measures

### Performance Optimizations
- **Virtual Scrolling**: For large datasets
- **Caching**: API response caching
- **Lazy Loading**: Component-level code splitting

## Troubleshooting

### Common Issues

1. **No Data Displayed**:
   - Check API endpoint connectivity
   - Verify authentication token
   - Ensure backend audit logging is enabled

2. **Export Not Working**:
   - Check browser download settings
   - Verify file permissions
   - Ensure CSV generation is working on backend

3. **Charts Not Rendering**:
   - Verify Recharts installation
   - Check data format from API
   - Ensure proper data structure

### Debug Information
- Check browser console for errors
- Verify API responses in Network tab
- Confirm authentication status

## Support

For technical support or questions about the audit log system:
- Check the backend API documentation
- Review the console logs for error messages
- Ensure all dependencies are properly installed

---

**Note**: This audit log system is designed for administrative use only and should be used in compliance with privacy regulations and company policies. 