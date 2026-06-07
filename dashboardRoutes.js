const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('./dashboardController');
const { protect } = require('./authMiddleware');

// Rota Privada: /api/dashboard/stats
router.get('/stats', protect, getDashboardStats);

module.exports = router;
