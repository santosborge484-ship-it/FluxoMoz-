const Product = require('./product'); // Importa o modelo que está na raiz

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Private (Apenas vendedores logados)
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, productType, stock, affiliateCommissionPercent } = req.body;

        // Gera um código único para o link de pagamento (Ex: fluxo-xyz123)
        const randomString = Math.random().toString(36).substring(2, 8);
        const paymentLink = `fluxo-${randomString}`;

        // Cria o produto no banco de dados e atrela-o ao ID do vendedor (req.user vem do authMiddleware)
        const product = await Product.create({
            vendor: req.user._id,
            name,
            description,
            price,
            productType,
            stock,
            paymentLink,
            affiliateCommissionPercent: affiliateCommissionPercent || 0
        });

        res.status(201).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao criar produto: ' + error.message });
    }
};

// @desc    Obter todos os produtos do vendedor logado
// @route   GET /api/products/my-products
// @access  Private
exports.getMyProducts = async (req, res) => {
    try {
        // Encontra apenas os produtos onde o campo 'vendor' seja igual ao ID do usuário atual
        const products = await Product.find({ vendor: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao buscar produtos: ' + error.message });
    }
};

// @desc    Obter detalhes de UM produto pelo Link de Pagamento (Público)
// @route   GET /api/products/link/:paymentLink
// @access  Public (Usado na página de Checkout do cliente)
exports.getProductByLink = async (req, res) => {
    try {
        // Busca o produto e inclui também o nome do vendedor que o criou
        const product = await Product.findOne({ paymentLink: req.params.paymentLink })
                                     .populate('vendor', 'name');

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Produto não encontrado ou link inválido.' });
        }

        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro no servidor: ' + error.message });
    }
};
