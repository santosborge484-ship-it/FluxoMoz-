const express = require('express');
const router = express.Router();

const { submitKyc } = require('./kycController');
const { protect } = require('./authMiddleware');

// Rota POST para submeter os documentos: /api/kyc/submit
router.post('/submit', protect, submitKyc);

module.exports = router;
