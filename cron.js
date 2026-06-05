const cron = require('node-cron');
const Order = require('./Order'); // Modelos na raiz
const User = require('./user');

// Agendamento estrito: Executa a cada 24 horas (à meia-noite)
cron.schedule('0 0 * * *', async () => {
    console.log('[FluxoMoz Cron] Iniciando verificação de fundos retidos (Garantia de 24h)...');
    
    try {
        // Define o limite exato: 24 horas atrás a partir do momento atual
        const limite24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Busca todos os pedidos em "garantia_24h" que foram atualizados antes desse limite
        const pedidosParaLiberar = await Order.find({
            status: 'garantia_24h',
            updatedAt: { $lte: limite24h }
        });

        if (pedidosParaLiberar.length === 0) {
            console.log('[FluxoMoz Cron] Nenhum fundo pendente para libertação hoje.');
            return;
        }

        // Processa cada pedido um por um
        for (const pedido of pedidosParaLiberar) {
            // 1. Move o dinheiro do Vendedor (Tira do Retido e coloca no Disponível)
            await User.findByIdAndUpdate(pedido.vendor, {
                $inc: { 
                    'wallet.escrowBalance': -pedido.financials.vendorNetRevenue,
                    'wallet.availableBalance': pedido.financials.vendorNetRevenue
                }
            });

            // 2. Se a venda teve um afiliado, liberta a comissão dele também
            if (pedido.affiliate && pedido.financials.affiliateCommission > 0) {
                await User.findByIdAndUpdate(pedido.affiliate, {
                    $inc: { 
                        'wallet.escrowBalance': -pedido.financials.affiliateCommission,
                        'wallet.availableBalance': pedido.financials.affiliateCommission
                    }
                });
            }

            // 3. Muda o status da encomenda para "Concluído"
            pedido.status = 'concluido';
            await pedido.save();
        }

        console.log(`[FluxoMoz Cron] Sucesso! ${pedidosParaLiberar.length} transações movidas para o saldo disponível.`);
    } catch (error) {
        console.error('[Erro Crítico Cron] Falha ao processar liberações:', error);
    }
});

module.exports = cron;