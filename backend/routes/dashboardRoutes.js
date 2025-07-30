const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');
const { logActivity } = require('../middleware/auditLogger');

router.get('/stats', logActivity('ADMIN_GET_DASHBOARD_STATS'), dashboardController.getStats);

module.exports = router;