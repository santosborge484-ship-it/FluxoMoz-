const User = require('./user');

// @desc    Submeter documentos completos para verificação KYC
// @route   POST /api/kyc/submit
// @access  Private (Apenas vendedores logados e com contacto verificado)
exports.submitKyc = async (req, res) => {
    try {
        const { biNumber, nuit, documentFrontUrl, documentBackUrl, selfieUrl, selfieWithPaperUrl } = req.body;
        
        const user = await User.findById(req.user._id);

        if (user.kyc.status === 'aprovado') {
            return res.status(400).json({ status: 'error', message: 'O seu KYC já está aprovado.' });
        }

        if (user.kyc.status === 'pendente') {
            return res.status(400).json({ status: 'error', message: 'Os seus documentos já estão em análise. Aguarde.' });
        }

        // Validação rigorosa: exige os 4 documentos
        if (!documentFrontUrl || !documentBackUrl || !selfieUrl || !selfieWithPaperUrl) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'A submissão falhou. É obrigatório enviar a Frente, Verso, Selfie simples e a Selfie segurando o documento com a data.' 
            });
        }

        // Atualiza os dados de identidade
        user.kyc.biNumber = biNumber;
        user.kyc.nuit = nuit;
        user.kyc.documentFrontUrl = documentFrontUrl;
        user.kyc.documentBackUrl = documentBackUrl;
        user.kyc.selfieUrl = selfieUrl;
        user.kyc.selfieWithPaperUrl = selfieWithPaperUrl;
        
        // Muda o status para análise
        user.kyc.status = 'pendente';
        user.kyc.adminMessage = ''; // Limpa mensagens de rejeições anteriores
        
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Documentos KYC submetidos com sucesso. A equipa da FluxoMoz irá analisar a sua identidade.',
            kycStatus: user.kyc.status
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao submeter KYC: ' + error.message });
    }
};
