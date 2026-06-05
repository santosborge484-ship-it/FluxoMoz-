const User = require('./user');

// @desc    Submeter documentos para verificação KYC
// @route   POST /api/kyc/submit
// @access  Private (Apenas vendedores logados)
exports.submitKyc = async (req, res) => {
    try {
        const { biNumber, nuit, biImageUrl, selfieUrl } = req.body;
        
        // Encontra o usuário atual no banco de dados
        const user = await User.findById(req.user._id);

        if (user.kyc.status === 'aprovado') {
            return res.status(400).json({ status: 'error', message: 'O seu KYC já está aprovado. Nenhuma ação necessária.' });
        }

        if (user.kyc.status === 'em_analise') {
            return res.status(400).json({ status: 'error', message: 'Os seus documentos já estão em análise. Aguarde a aprovação.' });
        }

        // Atualiza os dados do usuário com as informações de segurança
        user.kyc.biNumber = biNumber;
        user.kyc.nuit = nuit;
        user.kyc.status = 'em_analise';
        
        // Salva as alterações no banco de dados
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Documentos KYC submetidos com sucesso. Estão agora em análise.',
            kycStatus: user.kyc.status
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao submeter KYC: ' + error.message });
    }
};
