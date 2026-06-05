const express = require('express');
const router = express.Router();

// Importa as funções do controlador na mesma pasta (raiz)
const { registerUser, authUser } = require('./authController');

// Rota POST para registar novo vendedor: /api/auth/register
router.post('/register', registerUser);

// Rota POST para login: /api/auth/login
router.post('/login', authUser);

module.exports = router;
