const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor, use um e-mail válido']
    },
    phone: {
        type: String,
        required: [true, 'O telemóvel é obrigatório']
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        minlength: 8,
        select: false 
    },
    // SISTEMA DE CONTACTO VERIFICADO (OTP ZERO CUSTO)
    isContactVerified: {
        type: Boolean,
        default: false
    },
    otpCode: {
        type: String // Guarda o código de 6 dígitos
    },
    otpExpires: {
        type: Date // Validade do código (ex: 10 minutos)
    },
    // SISTEMA DE NÍVEIS DE REPUTAÇÃO
    reputation: {
        type: String,
        enum: ['bronze', 'prata', 'ouro', 'premium'],
        default: 'bronze'
    },
    // SISTEMA AVANÇADO DE KYC E IDENTIDADE
    kyc: {
        status: {
            type: String,
            enum: ['nao_iniciado', 'pendente', 'aprovado', 'rejeitado', 'correcao_solicitada'],
            default: 'nao_iniciado'
        },
        biNumber: String,
        nuit: String,
        documentFrontUrl: String,      // Frente do BI
        documentBackUrl: String,       // Verso do BI
        selfieUrl: String,             // Rosto do Vendedor
        selfieWithPaperUrl: String,    // Rosto + BI + Papel (FluxoMoz Data)
        adminMessage: String           // Motivo da rejeição ou correção
    },
    wallet: {
        availableBalance: { type: Number, default: 0 },
        escrowBalance: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 }
    },
    affiliateCode: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Encriptação de senha antes de salvar no MongoDB (Bcrypt)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Método para verificar a senha
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
