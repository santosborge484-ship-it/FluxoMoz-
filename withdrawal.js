const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'O valor do saque é obrigatório'],
        min: [100, 'O valor mínimo de saque é 100 MZN']
    },
    status: {
        type: String,
        enum: ['pendente', 'processando', 'concluido', 'rejeitado'],
        default: 'pendente'
    },
    payoutMethod: {
        type: String,
        enum: ['mpesa', 'emola'],
        required: true
    },
    payoutPhone: {
        type: String,
        required: true
    },
    transactionId: {
        type: String, // O ID que a operadora gera quando a FluxoMoz envia o dinheiro
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
