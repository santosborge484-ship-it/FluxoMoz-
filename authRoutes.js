const express = require('express');
const router = express.Router();

const { register, login, verifyOtp } = require('./authController');

// Rotas Públicas de Autenticação da FluxoMoz
router.post('/register', register);
router.post('/login', login);

// NOVA ROTA: Verificação de Contacto (OTP)
router.post('/verify-otp', verifyOtp);

module.exports = router;
