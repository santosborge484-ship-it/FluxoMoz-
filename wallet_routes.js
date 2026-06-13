const express = require('express');
const router = express.Router();
const { getWallet, requestWithdraw } = require('./wallet_controller');
const { protect } = require('./auth_middleware');

// Rotas estritamente protegidas
router.get('/', protect, getWallet);
router.post('/withdraw', protect, requestWithdraw);

module.exports = router;
