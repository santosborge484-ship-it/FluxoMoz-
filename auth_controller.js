const jwt = require('jsonwebtoken');
const User = require('./user');
const Wallet = require('./wallet');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ mensagem: 'Por favor, preencha todos os campos.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ mensagem: 'Este email já está registado na FluxoMoz.' });
        }

        const user = await User.create({ name, email, password, phone });

        if (user) {
            // Cria a carteira automaticamente
            await Wallet.create({ user: user._id });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ mensagem: 'Dados de utilizador inválidos.' });
        }
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro no servidor', erro: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ mensagem: 'Email ou senha incorretos.' });
        }
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro no servidor', erro: error.message });
    }
};

module.exports = { registerUser, loginUser };
