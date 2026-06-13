const express = require('express');
const router = express.Router();
const { createProduct, getActiveProducts } = require('./product_controller');
const { protect } = require('./auth_middleware');

// Rota para a Homepage (Pública) e Criação de Produto (Protegida)
router.route('/')
    .get(getActiveProducts)
    .post(protect, createProduct);

module.exports = router;
