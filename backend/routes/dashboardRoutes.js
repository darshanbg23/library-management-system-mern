const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');

// GET /api/dashboard - Get dashboard data
router.get('/', getDashboard);

module.exports = router;
