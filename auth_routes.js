const express = require('express');
const router = express.Router();

// Importações diretas da raiz
const { registerUser, loginUser } = require('./auth_controller');
const { protect } = require('./auth_middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, (req, res) => {
    res.status(200).json({
        mensagem: 'Acesso autorizado',
        utilizador: req.user
    });
});

module.exports = router;
