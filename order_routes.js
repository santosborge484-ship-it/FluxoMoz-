const express = require('express');
const router = express.Router();
const { getProductForCheckout, processCheckout } = require('./order_controller');

// Rotas públicas de Checkout (baseadas no slug do produto gerado pelo vendedor)
router.get('/checkout/:slug', getProductForCheckout);
router.post('/checkout/:slug', processCheckout);

module.exports = router;
