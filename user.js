const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome completo é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        minlength: 6
    },
    phone: {
        type: String,
        required: [true, 'O telefone de contacto é obrigatório'],
        trim: true
    },
    role: {
        type: String,
        enum: ['merchant', 'admin'],
        default: 'merchant'
    },
    // Sistema de Afiliados
    affiliateCode: {
        type: String,
        unique: true,
        sparse: true // Permite nulo enquanto não gerado, mas exige unicidade se preenchido
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    affiliateCommission: {
        type: Number,
        default: 1.0 // Percentual padrão de comissão para afiliados
    },
    // Módulo KYC (Obrigatório para saques)
    kyc: {
        status: {
            type: String,
            enum: ['pending_submission', 'under_review', 'approved', 'rejected'],
            default: 'pending_submission'
        },
        biNumber: { type: String, default: null },
        nuitNumber: { type: String, default: null },
        biFrontImage: { type: String, default: null },
        biBackImage: { type: String, default: null },
        selfieImage: { type: String, default: null },
        reviewedAt: { type: Date, default: null }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Cria automaticamente campos 'createdAt' e 'updatedAt'
});

// Middleware do Mongoose: Criptografar a senha antes de salvar no banco
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método auxiliar para comparar senhas no login
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
