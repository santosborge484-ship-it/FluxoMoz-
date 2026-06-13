const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // Vínculos com o Produto e o Vendedor
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Dados do Comprador (Requisito da especificação)
    buyerName: { type: String, required: true, trim: true },
    buyerPhone: { type: String, required: true, trim: true },
    buyerCity: { type: String, required: true, trim: true },
    buyerNeighborhood: { type: String, required: true, trim: true },
    buyerReference: { type: String, trim: true }, // Ponto de referência
    
    // Dados Financeiros
    amountPaid: { type: Number, required: true },
    
    // Status da Venda
    status: {
        type: String,
        enum: ['Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado'],
        default: 'Pago' // Como é integração de pagamento direto, nasce como pago
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
