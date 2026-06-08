const express = require('express');
const router = express.Router();

const { createProduct, getMyProducts, getProductByLink } = require('./productController');
const { protect, requireKYC } = require('./authMiddleware');

// Rota Pública (O cliente final não precisa de login nem KYC para ver o produto)
router.get('/link/:paymentLink', getProductByLink);

// Rotas Privadas do Vendedor
router.get('/my-products', protect, getMyProducts); // Pode ver os próprios produtos mesmo sem KYC

// BARREIRA ATIVA: Apenas vendedores verificados podem criar produtos para venda
router.post('/', protect, requireKYC, createProduct);

module.exports = router;
