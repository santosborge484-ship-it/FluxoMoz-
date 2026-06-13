const Wallet = require('./wallet');
const User = require('./user');

// @desc    Obter saldo e detalhes da carteira do utilizador logado
// @route   GET /api/wallet
// @access  Privado
const getWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            return res.status(404).json({ mensagem: 'Carteira não encontrada.' });
        }

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao aceder à carteira.', erro: error.message });
    }
};

// @desc    Solicitar saque do saldo disponível
// @route   POST /api/wallet/withdraw
// @access  Privado
const requestWithdraw = async (req, res) => {
    try {
        const { amount } = req.body;
        const wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            return res.status(404).json({ mensagem: 'Carteira não encontrada.' });
        }

        // Validação 1: Tem saldo suficiente?
        if (wallet.availableBalance < amount) {
            return res.status(400).json({ mensagem: 'Saldo insuficiente para este saque.' });
        }

        // Validação 2: O valor mínimo de saque
        if (amount < 100) {
            return res.status(400).json({ mensagem: 'O valor mínimo para saque é de 100 MT.' });
        }

        // Calcula a taxa padrão da plataforma (3%)
        const platformFee = amount * 0.03;
        const finalAmount = amount - platformFee;

        // Deduz imediatamente o valor do saldo disponível para evitar saques duplos
        wallet.availableBalance -= amount;
        await wallet.save();

        // (Futuro: Aqui entraria a gravação do log de saque no banco de dados para a Diretoria aprovar)

        res.status(200).json({
            mensagem: 'Solicitação de saque recebida com sucesso.',
            valorSolicitado: amount,
            taxaPlataforma: platformFee,
            valorAReceber: finalAmount,
            novoSaldo: wallet.availableBalance
        });

    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao processar saque.', erro: error.message });
    }
};

module.exports = {
    getWallet,
    requestWithdraw
};
