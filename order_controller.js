const Order = require('./order');
const Product = require('./product');
const Wallet = require('./wallet');

// @desc    Buscar dados do produto através do Link (Slug) para mostrar na tela de pagamento
// @route   GET /api/orders/checkout/:slug
// @access  Público (O comprador não precisa ter conta)
const getProductForCheckout = async (req, res) => {
    try {
        const product = await Product.findOne({ paymentSlug: req.params.slug }).populate('user', 'name');

        if (!product) {
            return res.status(404).json({ mensagem: 'Link de pagamento inválido ou produto não encontrado.' });
        }

        if (product.stock <= 0 || product.status !== 'Ativo') {
            return res.status(400).json({ mensagem: 'Este produto está esgotado ou indisponível no momento.' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao carregar o checkout.', erro: error.message });
    }
};

// @desc    Processar o pagamento, criar o pedido e mover dinheiro para o Escrow
// @route   POST /api/orders/checkout/:slug
// @access  Público
const processCheckout = async (req, res) => {
    try {
        const { buyerName, buyerPhone, buyerCity, buyerNeighborhood, buyerReference } = req.body;

        // 1. Encontra o produto pelo link
        const product = await Product.findOne({ paymentSlug: req.params.slug });
        if (!product || product.stock <= 0) {
            return res.status(400).json({ mensagem: 'Produto indisponível.' });
        }

        // (Futuro: Aqui entraria a comunicação com a API do M-Pesa / E-Mola para cobrar o cliente)
        // Como o M-Pesa aprovou, prosseguimos:

        // 2. Cria o Pedido Oficial
        const order = await Order.create({
            product: product._id,
            merchant: product.user,
            buyerName,
            buyerPhone,
            buyerCity,
            buyerNeighborhood,
            buyerReference,
            amountPaid: product.price,
            status: 'Pago'
        });

        // 3. Desconta o estoque do produto
        product.stock -= 1;
        await product.save(); // O modelo Product já muda para 'Sem Estoque' sozinho se chegar a 0!

        // 4. Injeta o dinheiro na Carteira do Lojista (Em Garantia / Escrow) e atualiza a Receita Total
        const merchantWallet = await Wallet.findOne({ user: product.user });
        if (merchantWallet) {
            merchantWallet.escrowBalance += product.price; // Dinheiro bloqueado por 24h
            merchantWallet.totalRevenue += product.price;  // O gráfico de faturamento sobe!
            await merchantWallet.save();
        }

        res.status(201).json({
            mensagem: 'Pagamento aprovado! Pedido realizado com sucesso.',
            numeroPedido: order._id
        });

    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao processar o pagamento.', erro: error.message });
    }
};

module.exports = {
    getProductForCheckout,
    processCheckout
};
