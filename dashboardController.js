const Order = require('./Order');
const Product = require('./product');
const User = require('./user');

// @desc    Obter estatísticas principais para o Dashboard do Vendedor
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const vendorId = req.user._id;

        // 1. Vai buscar os dados da carteira do vendedor
        const vendor = await User.findById(vendorId);
        
        // 2. Conta o total de produtos ativos
        const totalProducts = await Product.countDocuments({ vendor: vendorId, status: 'ativo' });

        // 3. Conta os pedidos pendentes
        const pendingOrders = await Order.countDocuments({ vendor: vendorId, status: 'pendente' });

        // 4. Calcula as vendas de HOJE
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); // Define para a meia-noite de hoje

        const todaysOrders = await Order.find({ 
            vendor: vendorId, 
            createdAt: { $gte: startOfToday },
            status: { $ne: 'pendente' } // Considera apenas o que já foi pago ou está em garantia
        });

        const todaySalesAmount = todaysOrders.reduce((acc, order) => acc + order.financials.vendorNetRevenue, 0);

        // 5. Conta o número de Clientes Únicos (baseado no número de telemóvel)
        const uniqueCustomers = await Order.distinct('customer.phone', { vendor: vendorId });

        // 6. Calcula o total de cliques gerados nas redes sociais (UTM Tracking)
        const allProducts = await Product.find({ vendor: vendorId }).select('stats.clicks');
        const totalClicks = allProducts.reduce((acc, product) => acc + product.stats.clicks, 0);

        // Envia o pacote completo e calculado para o Frontend
        res.status(200).json({
            status: 'success',
            data: {
                totalRevenue: vendor.wallet.totalRevenue,           // Receita Total Histórica
                availableBalance: vendor.wallet.availableBalance,   // Saldo Disponível para Saque
                escrowBalance: vendor.wallet.escrowBalance,         // Saldo Retido (Garantia)
                todaySales: todaySalesAmount,                       // Vendas de Hoje
                pendingOrders,                                      // Pedidos Aguardando Pagamento
                totalCustomers: uniqueCustomers.length,             // Clientes Únicos
                totalProducts,                                      // Produtos Ativos
                totalClicks                                         // Cliques em Links
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao carregar dashboard: ' + error.message });
    }
};
