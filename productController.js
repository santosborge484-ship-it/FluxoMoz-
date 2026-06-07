const Product = require('./product');

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
    try {
        // Recebe os novos campos do frontend
        const { name, description, price, productType, stock, image, category, deliveryOptions, affiliateCommissionPercent } = req.body;

        const randomString = Math.random().toString(36).substring(2, 8);
        const paymentLink = `fluxo-${randomString}`;

        const product = await Product.create({
            vendor: req.user._id,
            name,
            description,
            price,
            productType,
            stock,
            image,
            category,
            deliveryOptions,
            paymentLink,
            affiliateCommissionPercent: affiliateCommissionPercent || 0
        });

        res.status(201).json({ status: 'success', data: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao criar produto: ' + error.message });
    }
};

// @desc    Obter todos os produtos do vendedor logado
// @route   GET /api/products/my-products
// @access  Private
exports.getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ vendor: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao buscar produtos: ' + error.message });
    }
};

// @desc    Obter detalhes de UM produto (Público) & Registar Clique/Origem
// @route   GET /api/products/link/:paymentLink?source=whatsapp
// @access  Public
exports.getProductByLink = async (req, res) => {
    try {
        const product = await Product.findOne({ paymentLink: req.params.paymentLink })
                                     .populate('vendor', 'name');

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Produto não encontrado.' });
        }

        // LÓGICA DE RASTREAMENTO DE MARKETING
        const source = req.query.source ? req.query.source.toLowerCase() : 'other';
        
        // Atualiza os cliques no banco de dados
        product.stats.clicks += 1;
        if (product.stats.sources[source] !== undefined) {
            product.stats.sources[source] += 1;
        } else {
            product.stats.sources.other += 1;
        }
        await product.save();

        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro no servidor: ' + error.message });
    }
};
