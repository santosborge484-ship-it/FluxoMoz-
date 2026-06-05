const Order = require('./order'); // Importa os modelos na raiz
const Product = require('./product');
const User = require('./user');

// @desc    Criar Pedido a partir do Checkout (Cliente Final)
// @route   POST /api/orders/checkout
// @access  Public
exports.createOrder = async (req, res) => {
    try {
        const { paymentLink, customerData, paymentMethod, affiliateCode } = req.body;

        // 1. Encontra o produto
        const product = await Product.findOne({ paymentLink });
        if (!product || product.stock <= 0 || product.status !== 'ativo') {
            return res.status(400).json({ status: 'error', message: 'Produto indisponível ou sem estoque.' });
        }

        // 2. Matemática Financeira (O "Split" da FluxoMoz)
        const totalPaid = product.price;
        const platformFee = totalPaid * 0.03; // Taxa fixa da FluxoMoz: 3%
        let affiliateCommission = 0;
        let affiliateId = null;

        // Se a venda veio por um afiliado
        if (affiliateCode && product.affiliateCommissionPercent > 0) {
            const affiliate = await User.findOne({ affiliateCode });
            if (affiliate) {
                affiliateId = affiliate._id;
                affiliateCommission = totalPaid * (product.affiliateCommissionPercent / 100);
            }
        }

        // O que sobra limpo para o vendedor
        const vendorNetRevenue = totalPaid - platformFee - affiliateCommission;

        // 3. Criar o Pedido como 'pendente' (Aguardando o PIN no telemóvel)
        const order = await Order.create({
            product: product._id,
            vendor: product.vendor,
            affiliate: affiliateId,
            customer: customerData,
            financials: {
                totalPaid,
                platformFee,
                affiliateCommission,
                vendorNetRevenue
            },
            status: 'pendente',
            paymentMethod
        });

        // NOTA: Aqui no futuro, acionaremos a API do M-Pesa para enviar o Push USSD ao cliente.
        // Simulamos o retorno de um ID de transação para continuar o fluxo.

        res.status(201).json({
            status: 'success',
            message: 'Pedido criado. Aguardando pagamento.',
            orderId: order._id
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao processar checkout: ' + error.message });
    }
};

// @desc    Webhook da Operadora (Confirmação de Pagamento)
// @route   POST /api/orders/webhook/payment
// @access  Public (Mas oculto, chamado apenas pela Vodacom/Movitel)
exports.paymentWebhook = async (req, res) => {
    try {
        const { orderId, transactionId, status } = req.body; // Dados que a operadora envia

        if (status === 'sucesso') {
            const order = await Order.findById(orderId);
            if (!order || order.status !== 'pendente') return res.status(200).send('Ignorado');

            // 1. Atualiza o pedido para o status de Garantia (Escrow de 24h)
            order.status = 'garantia_24h';
            order.transactionId = transactionId;
            await order.save();

            // 2. Reduz o estoque físico/digital do produto
            await Product.findByIdAndUpdate(order.product, { $inc: { stock: -1 } });

            // 3. Adiciona o dinheiro à CARTEIRA VIRTUAL RETIDA do Vendedor (NÃO ao saldo disponível ainda)
            await User.findByIdAndUpdate(order.vendor, {
                $inc: { 'wallet.escrowBalance': order.financials.vendorNetRevenue, 'wallet.totalRevenue': order.financials.totalPaid }
            });

            // Se houver afiliado, retém a comissão dele também
            if (order.affiliate) {
                await User.findByIdAndUpdate(order.affiliate, {
                    $inc: { 'wallet.escrowBalance': order.financials.affiliateCommission }
                });
            }

            return res.status(200).json({ status: 'success' }); // Responde "OK" para a operadora
        }

        res.status(400).json({ status: 'error', message: 'Pagamento falhou' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro no webhook' });
    }
};

// @desc    Obter todos os pedidos do vendedor logado
// @route   GET /api/orders/my-orders
// @access  Private
exports.getVendorOrders = async (req, res) => {
    try {
        const orders = await Order.find({ vendor: req.user._id })
            .populate('product', 'name productType')
            .sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', data: orders });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao buscar pedidos.' });
    }
};
