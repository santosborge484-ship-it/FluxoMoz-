// Caminhos corrigidos para a mesma pasta
const User = require('./user');
const generateToken = require('./generateToken');

// @desc    Registar novo vendedor
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { phone }] });

        if (userExists) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Já existe uma conta com este e-mail ou número de telefone.' 
            });
        }

        const baseName = name.split(' ')[0].toUpperCase();
        const affiliateCode = `${baseName}${Math.floor(1000 + Math.random() * 9000)}`;

        const user = await User.create({
            name,
            email,
            password,
            phone,
            affiliateCode
        });

        if (user) {
            res.status(201).json({
                status: 'success',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(400).json({ status: 'error', message: 'Dados de usuário inválidos.' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Autenticar vendedor & obter token
// @route   POST /api/auth/login
// @access  Public
exports.authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                status: 'success',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({ status: 'error', message: 'E-mail ou senha inválidos.' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro no servidor: ' + error.message });
    }
};
