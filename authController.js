const User = require('./user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Função auxiliar para gerar OTP de 6 dígitos
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
};

// @desc    Registar novo vendedor
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ status: 'error', message: 'E-mail ou Telemóvel já estão em uso.' });
        }

        const affiliateCode = `AFF-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        
        // Gera o OTP de 6 dígitos e define validade para 15 minutos
        const otpCode = generateOTP();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); 

        const user = await User.create({
            name, email, phone, password, affiliateCode, otpCode, otpExpires
        });

        res.status(201).json({
            status: 'success',
            message: 'Registo concluído. Verifique o seu código OTP.',
            data: {
                userId: user._id,
                _development_otp: otpCode 
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao registar: ' + error.message });
    }
};

// @desc    Verificar o código OTP (Contacto Verificado)
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
    try {
        const { userId, otpCode } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: 'error', message: 'Utilizador não encontrado.' });

        if (user.isContactVerified) {
            return res.status(400).json({ status: 'error', message: 'Contacto já verificado.' });
        }

        if (user.otpCode !== otpCode || user.otpExpires < new Date()) {
            return res.status(400).json({ status: 'error', message: 'Código inválido ou expirado.' });
        }

        // Marca como verificado e limpa o código
        user.isContactVerified = true;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            status: 'success',
            message: 'Contacto verificado com sucesso!',
            data: { token, name: user.name }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao verificar código.' });
    }
};

// @desc    Acesso Seguro ao Painel
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ status: 'error', message: 'E-mail ou senha incorretos.' });
        }

        // Bloqueia o login se o OTP inicial nunca tiver sido validado
        if (!user.isContactVerified) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'A sua conta precisa ser verificada.', 
                requiresOtp: true,
                userId: user._id
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            status: 'success',
            data: { token, name: user.name, kycStatus: user.kyc.status }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao fazer login: ' + error.message });
    }
};
