const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    affiliate: {
        type: mongoose.Schema.ObjectId,
        ref: 'User' // Opcional: Quem fez a venda se foi afiliado
    },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        // Morada apenas para produtos físicos
        city: { type: String },
        neighborhood: { type: String },
        reference: { type: String }
    },
    financials: {
        totalPaid: { type: Number, required: true }, // Valor total cobrado ao cliente
        platformFee: { type: Number, required: true }, // Taxa da FluxoMoz
        affiliateCommission: { type: Number, default: 0 },
        vendorNetRevenue: { type: Number, required: true } // O que vai para a carteira do vendedor
    },
    status: {
        type: String,
        enum: ['pendente', 'pago', 'garantia_24h', 'concluido', 'disputa', 'reembolsado'],
        default: 'pendente'
    },
    paymentMethod: {
        type: String,
        enum: ['mpesa', 'emola'],
        required: true
    },
    transactionId: {
        type: String, // ID único retornado pela operadora
        unique: true,
        sparse: true // Permite null enquanto está pendente
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
