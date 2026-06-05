const User = require('./user');
const Withdrawal = require('./withdrawal');

// @desc    Ver o saldo da carteira do vendedor
// @route   GET /api/wallet
// @access  Private
exports.getWalletBalance = async (req, res) => {
    try {
        // req.user já contém os dados do vendedor logado graças ao authMiddleware
        const user = await User.findById(req.user._id);

        res.status(200).json({
            status: 'success',
            data: {
                wallet: user.wallet,
                kycStatus: user.kyc.status
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao aceder à carteira.' });
    }
};

// @desc    Solicitar um saque (Levantamento de Fundos)
// @route   POST /api/wallet/withdraw
// @access  Private
exports.requestWithdrawal = async (req, res) => {
    try {
        const { amount, payoutMethod, payoutPhone } = req.body;
        const user = await User.findById(req.user._id);

        // 1. Verificação de Segurança de Identidade (KYC)
        if (user.kyc.status !== 'aprovado') {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Saque bloqueado. A sua identidade (BI/NUIT) ainda não foi aprovada.' 
            });
        }

        // 2. Verificação de Saldo Matemático
        if (amount > user.wallet.availableBalance) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Saldo insuficiente para este saque.' 
            });
        }

        // 3. Retira o dinheiro do saldo disponível IMEDIATAMENTE para evitar saques duplos (Segurança)
        user.wallet.availableBalance -= amount;
        await user.save();

        // 4. Cria o registo do pedido de saque
        const withdrawal = await Withdrawal.create({
            vendor: user._id,
            amount,
            payoutMethod,
            payoutPhone
        });

        res.status(201).json({
            status: 'success',
            message: 'Pedido de saque registado com sucesso. O processamento ocorrerá em breve.',
            data: withdrawal
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao solicitar saque: ' + error.message });
    }
};
