const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Um utilizador só pode ter uma carteira
    },
    // Saldo que já cumpriu o prazo de garantia e pode ser sacado
    availableBalance: {
        type: Number,
        required: true,
        default: 0.0,
        min: 0
    },
    // Saldo retido no fluxo Escrow de 24h pós-venda
    escrowBalance: {
        type: Number,
        required: true,
        default: 0.0,
        min: 0
    },
    // Histórico bruto acumulado de todas as vendas da história da conta
    totalRevenue: {
        type: Number,
        required: true,
        default: 0.0,
        min: 0
    },
    currency: {
        type: String,
        default: 'MZN'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Wallet', WalletSchema);
