const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');

// Rota para o registo de um novo vendedor
router.post('/register', registerUser);

// Rota para o login de um vendedor existente
router.post('/login', authUser);

module.exports = router;
