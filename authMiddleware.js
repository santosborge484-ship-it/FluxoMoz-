const jwt = require('jsonwebtoken');
const User = require('./user'); // Importa o modelo que está na raiz

const protect = async (req, res, next) => {
    let token;

    // Verifica se o cabeçalho de autorização existe e começa com 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Separa a palavra 'Bearer' do token em si
            token = req.headers.authorization.split(' ')[1];

            // Desencripta e verifica o token usando a nossa chave mestra
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Encontra o utilizador no banco e guarda-o na requisição (retirando a senha)
            req.user = await User.findById(decoded.id).select('-password');

            // Se tudo estiver certo, permite que o sistema avance para a próxima função
            next();
        } catch (error) {
            console.error('[Erro de Auth]', error);
            res.status(401).json({ 
                status: 'error', 
                message: 'Não autorizado, token inválido ou expirado.' 
            });
        }
    }

    // Se não houver nenhum token na requisição
    if (!token) {
        res.status(401).json({ 
            status: 'error', 
            message: 'Acesso negado, nenhum token fornecido.' 
        });
    }
};

module.exports = { protect };
