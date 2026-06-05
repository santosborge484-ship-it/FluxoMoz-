const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Cria o token usando a chave secreta e o ID do utilizador (vendedor)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = generateToken;
