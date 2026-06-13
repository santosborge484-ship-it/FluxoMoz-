const cron = require('node-cron');
const Wallet = require('./wallet');

const startCronJobs = () => {
    console.log('⏳ Sistema de Automação Financeira (Cron) Inicializado.');

    // Executa rigorosamente a cada 24 horas (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log('🔄 Iniciando varredura diária do sistema Escrow e Saques...');

        try {
            // Lógica de libertação do sistema Escrow (Garantia)
            // Encontra carteiras que tenham fundos retidos em escrowBalance
            const walletsWithEscrow = await Wallet.find({ escrowBalance: { $gt: 0 } });

            for (let wallet of walletsWithEscrow) {
                // Move o dinheiro da garantia para o saldo disponível
                const releasedAmount = wallet.escrowBalance;
                
                wallet.availableBalance += releasedAmount;
                wallet.escrowBalance = 0; // Zera a garantia após libertar
                
                await wallet.save();
                console.log(`✅ ${releasedAmount} MT libertados para a carteira ID: ${wallet.user}`);
            }

            console.log('✅ Varredura de 24h concluída com sucesso.');
        } catch (error) {
            console.error('❌ Erro durante a varredura financeira:', error.message);
        }
    });
};

module.exports = startCronJobs;
