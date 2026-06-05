const express = require('express');
const router = express.Router();

// Importa o controlador e o middleware de proteção (tudo na raiz)
const { createProduct, getMyProducts, getProductByLink } = require('./productController');
const { protect } = require('./authMiddleware');

// Rotas Privadas (O vendedor tem de passar o Token)
router.post('/', protect, createProduct); // Criar produto
router.get('/my-products', protect, getMyProducts); // Ver os seus próprios produtos

// Rota Pública (O cliente não precisa de estar logado para ver a página de checkout do link)
router.get('/link/:paymentLink', getProductByLink);

module.exports = router;
