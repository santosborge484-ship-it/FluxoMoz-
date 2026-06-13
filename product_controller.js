const Product = require('./product');
const crypto = require('crypto');

// @desc    Criar um novo produto e gerar link de pagamento único
// @route   POST /api/products
// @access  Privado (Apenas lojistas autenticados)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, image } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({ mensagem: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        // Gerar um código único aleatório de 6 caracteres para o link de pagamento
        const paymentSlug = crypto.randomBytes(3).toString('hex');

        const product = await Product.create({
            user: req.user._id, // Obtido do auth_middleware
            name,
            description,
            price,
            stock: stock || 0,
            category,
            image: image || 'placeholder.jpg',
            paymentSlug
        });

        res.status(201).json({
            mensagem: 'Produto criado com sucesso!',
            linkPagamento: `https://fluxomoz.app/pay/${paymentSlug}`,
            product
        });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar produto.', erro: error.message });
    }
};

// @desc    Listar todos os produtos ativos (Para a Homepage Marketplace)
// @route   GET /api/products
// @access  Público
const getActiveProducts = async (req, res) => {
    try {
        // Busca produtos ativos e popula os dados básicos do vendedor dono do produto
        const products = await Product.find({ status: 'Ativo' })
            .populate('user', 'name')
            .sort({ createdAt: -1 }); // Mais recentes primeiro

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar produtos.', erro: error.message });
    }
};

module.exports = {
    createProduct,
    getActiveProducts
};
