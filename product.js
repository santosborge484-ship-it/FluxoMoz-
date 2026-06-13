const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // O produto pertence a um vendedor específico
    },
    name: {
        type: String,
        required: [true, 'O nome do produto é obrigatório'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A descrição do produto é obrigatória'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'O preço do produto é obrigatório'],
        min: [0, 'O preço não pode ser negativo']
    },
    stock: {
        type: Number,
        required: [true, 'A quantidade em stock é obrigatória'],
        default: 0,
        min: 0
    },
    category: {
        type: String,
        required: [true, 'A categoria do produto é obrigatória'],
        trim: true
    },
    image: {
        type: String,
        default: 'placeholder.jpg' // URL da imagem do produto
    },
    status: {
        type: String,
        enum: ['Ativo', 'Sem Estoque', 'Oculto'],
        default: 'Ativo'
    },
    // Código único gerado para o link de pagamento ex: 'abc123'
    paymentSlug: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true
});

// Middleware para atualizar automaticamente o status se o stock chegar a zero
ProductSchema.pre('save', function(next) {
    if (this.stock === 0 && this.status === 'Ativo') {
        this.status = 'Sem Estoque';
    } else if (this.stock > 0 && this.status === 'Sem Estoque') {
        this.status = 'Ativo';
    }
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
