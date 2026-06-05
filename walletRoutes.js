const express = require('express');
const router = express.Router();

const { getWalletBalance, requestWithdrawal } = require('./walletController');
const { protect } = require('./authMiddleware');

// Rotas da Carteira (Todas requerem que o vendedor esteja logado)
router.get('/', protect, getWalletBalance); // Ver saldo
router.post('/withdraw', protect, requestWithdrawal); // Pedir saque

module.exports = router;
