const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
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
        min: 0 
    },
    // NOVOS CAMPOS: Visuais e Logísticos
    image: {
        type: String // URL da imagem em base64 ou link externo
    },
    category: {
        type: String
    },
    deliveryOptions: [{
        name: { type: String }, // Ex: "Levantamento", "Entrega Local"
        fee: { type: Number, default: 0 } // Preço em MZN
    }],
    status: {
        type: String,
        enum: ['ativo', 'sem_estoque', 'oculto'],
        default: 'ativo'
    },
    paymentLink: {
        type: String,
        unique: true
    },
    digitalFileUrl: {
        type: String,
        select: false 
    },
    affiliateCommissionPercent: {
        type: Number,
        default: 0, 
        max: 80 
    },
    // NOVO CAMPO: Estatísticas de Marketing (UTM Tracking)
    stats: {
        clicks: { type: Number, default: 0 },
        sources: {
            whatsapp: { type: Number, default: 0 },
            facebook: { type: Number, default: 0 },
            instagram: { type: Number, default: 0 },
            tiktok: { type: Number, default: 0 },
            other: { type: Number, default: 0 }
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
