const express = require('express');
const router = express.Router();

const { getWalletBalance, requestWithdrawal } = require('./walletController');
const { protect, requireKYC } = require('./authMiddleware');

// Rotas da Carteira
router.get('/', protect, getWalletBalance); // Pode ver o saldo da carteira (Acesso Limitado)

// BARREIRA ATIVA: Apenas vendedores verificados podem pedir saques do M-Pesa/E-Mola
router.post('/withdraw', protect, requireKYC, requestWithdrawal);

module.exports = router;
