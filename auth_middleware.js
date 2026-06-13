const jwt = require('jsonwebtoken');
const User = require('./user');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Busca na raiz
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('Erro de Autenticação:', error.message);
            res.status(401).json({ mensagem: 'Não autorizado. Token inválido ou expirado.' });
        }
    }

    if (!token) {
        res.status(401).json({ mensagem: 'Não autorizado. Nenhum token fornecido.' });
    }
};

module.exports = { protect };
