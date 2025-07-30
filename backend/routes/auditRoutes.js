const express = require('express');
const router = express.Router();
const auditController = require('../controller/auditController');
const { authorization, authorizeRole } = require('../security/auth');
const { logActivity } = require('../middleware/auditLogger');

// All routes require admin authentication
router.use(authorization);
router.use(authorizeRole('admin'));

// Get all audit logs with filtering and pagination
router.get('/logs', logActivity('ADMIN_GET_AUDIT_LOGS'), auditController.getAuditLogs);

// Get audit log statistics
router.get('/stats', logActivity('ADMIN_GET_AUDIT_STATS'), auditController.getAuditStats);

// Get user-specific audit logs
router.get('/user/:userId', logActivity('ADMIN_GET_USER_AUDIT_LOGS'), auditController.getUserAuditLogs);

// Export audit logs to CSV
router.get('/export', logActivity('ADMIN_EXPORT_AUDIT_LOGS'), auditController.exportAuditLogs);

module.exports = router; 