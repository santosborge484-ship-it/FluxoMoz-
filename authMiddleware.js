const jwt = require('jsonwebtoken');
const User = require('./user');

// Middleware 1: Verifica se o utilizador tem o Token de Login válido
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Não autorizado. Acesso negado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Sessão expirada ou token inválido.' });
    }
};

// Middleware 2: Barreira Rigorosa de KYC (Novo)
exports.requireKYC = (req, res, next) => {
    if (req.user.kyc.status !== 'aprovado') {
        return res.status(403).json({ 
            status: 'error', 
            message: 'Acesso restrito. A sua conta precisa de ser verificada e aprovada (KYC) para realizar esta ação.',
            kycStatus: req.user.kyc.status
        });
    }
    next();
};
