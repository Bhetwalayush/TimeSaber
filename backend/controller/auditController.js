const AuditLog = require('../model/auditLog');
const User = require('../model/Users');

// Get all audit logs with pagination and filtering
exports.getAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};
        
        const userId = req.cookies.userId;
        if (userId) {
            filter.userId = userId;
        }
        
        if (req.query.action) {
            filter.action = req.query.action;
        }
        
        if (req.query.userEmail) {
            filter.userEmail = { $regex: req.query.userEmail, $options: 'i' };
        }
        
        if (req.query.startDate && req.query.endDate) {
            filter.timestamp = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        // Get total count for pagination
        const totalLogs = await AuditLog.countDocuments(filter);
        
        // Get audit logs with pagination
        const auditLogs = await AuditLog.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'first_name last_name email');

        res.json({
            logs: auditLogs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalLogs / limit),
                totalLogs,
                hasNext: page < Math.ceil(totalLogs / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
};

// Get audit log statistics
exports.getAuditStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Get counts for different time periods
        const todayLogs = await AuditLog.countDocuments({ timestamp: { $gte: startOfDay } });
        const weekLogs = await AuditLog.countDocuments({ timestamp: { $gte: startOfWeek } });
        const monthLogs = await AuditLog.countDocuments({ timestamp: { $gte: startOfMonth } });
        const totalLogs = await AuditLog.countDocuments();

        // Get action-wise statistics
        const actionStats = await AuditLog.aggregate([
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Get top active users
        const topUsers = await AuditLog.aggregate([
            {
                $group: {
                    _id: '$userId',
                    userName: { $first: '$userName' },
                    userEmail: { $first: '$userEmail' },
                    activityCount: { $sum: 1 }
                }
            },
            {
                $sort: { activityCount: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.json({
            timeStats: {
                today: todayLogs,
                thisWeek: weekLogs,
                thisMonth: monthLogs,
                total: totalLogs
            },
            actionStats,
            topUsers
        });
    } catch (error) {
        console.error('Error fetching audit stats:', error);
        res.status(500).json({ error: 'Failed to fetch audit statistics' });
    }
};

// Get user-specific audit logs
exports.getUserAuditLogs = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const totalLogs = await AuditLog.countDocuments({ userId });
        
        const userLogs = await AuditLog.find({ userId })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            logs: userLogs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalLogs / limit),
                totalLogs,
                hasNext: page < Math.ceil(totalLogs / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching user audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch user audit logs' });
    }
};

// Export audit logs to CSV
exports.exportAuditLogs = async (req, res) => {
    try {
        const filter = {};
        
        if (req.query.startDate && req.query.endDate) {
            filter.timestamp = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        const auditLogs = await AuditLog.find(filter)
            .sort({ timestamp: -1 })
            .populate('userId', 'first_name last_name email');

        // Convert to CSV format
        const csvHeader = 'Timestamp,User Name,User Email,Action,IP Address,User Agent,Details\n';
        const csvRows = auditLogs.map(log => {
            const details = JSON.stringify(log.details).replace(/"/g, '""');
            return `"${log.timestamp}","${log.userName}","${log.userEmail}","${log.action}","${log.ipAddress || ''}","${log.userAgent || ''}","${details}"`;
        }).join('\n');

        const csvContent = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=audit_logs.csv');
        res.send(csvContent);
    } catch (error) {
        console.error('Error exporting audit logs:', error);
        res.status(500).json({ error: 'Failed to export audit logs' });
    }
}; 