const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome completo é obrigatório']
    },
    email: {
        type: String,
        required: [true, 'E-mail é obrigatório'],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'E-mail inválido']
    },
    password: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        select: false // Nunca retorna a senha nas consultas normais (Segurança)
    },
    phone: {
        type: String, // Número M-Pesa / E-Mola principal
        required: [true, 'Número de telemóvel é obrigatório'],
        unique: true
    },
    // Carteira Virtual (Valores críticos - controlados apenas pelo backend)
    wallet: {
        availableBalance: { type: Number, default: 0 }, // Saldo para saque
        escrowBalance: { type: Number, default: 0 },    // Saldo retido (Garantia 24h)
        totalRevenue: { type: Number, default: 0 }      // Todo o dinheiro já processado
    },
    // KYC - Conheça o seu Cliente
    kyc: {
        status: {
            type: String,
            enum: ['pendente', 'em_analise', 'aprovado', 'rejeitado'],
            default: 'pendente'
        },
        biNumber: { type: String, select: false },
        nuit: { type: String, select: false }
    },
    role: {
        type: String,
        enum: ['vendedor', 'admin'],
        default: 'vendedor'
    },
    affiliateCode: {
        type: String,
        unique: true
    }
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Encriptar a senha antes de salvar no banco
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para verificar se a senha digitada bate com o hash salvo
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
