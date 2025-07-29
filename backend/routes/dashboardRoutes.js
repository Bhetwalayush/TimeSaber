const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');

router.get('/stats', dashboardController.getStats);

module.exports = router;