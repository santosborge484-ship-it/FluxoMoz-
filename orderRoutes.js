const express = require('express');
const router = express.Router();

// Importações na raiz
const { createOrder, paymentWebhook, getVendorOrders } = require('./orderController');
const { protect } = require('./authMiddleware');

// Rotas Públicas (Página de Checkout do Cliente e Webhook da Operadora)
router.post('/checkout', createOrder);
router.post('/webhook/payment', paymentWebhook);

// Rota Privada (Painel do Vendedor: Ver Vendas)
router.get('/my-orders', protect, getVendorOrders);

module.exports = router;
