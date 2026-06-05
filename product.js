const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true // O produto tem que pertencer a um vendedor
    },
    name: {
        type: String,
        required: [true, 'Nome do produto é obrigatório'],
        trim: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'Preço é obrigatório']
    },
    productType: {
        type: String,
        enum: ['fisico', 'digital'],
        required: true
    },
    stock: {
        type: Number,
        required: [true, 'Quantidade em estoque é obrigatória'],
        min: 0 // Impede estoque negativo
    },
    status: {
        type: String,
        enum: ['ativo', 'sem_estoque', 'oculto'],
        default: 'ativo'
    },
    paymentLink: {
        type: String,
        unique: true // Ex: abc123xyz gerado automaticamente
    },
    // Apenas para produtos digitais (Link enviado após pagamento)
    digitalFileUrl: {
        type: String,
        select: false 
    },
    affiliateCommissionPercent: {
        type: Number,
        default: 0, // Se 0, não está na vitrine de afiliados
        max: 80 // Limite de comissão para proteger o vendedor
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
