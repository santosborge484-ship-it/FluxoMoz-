require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importações locais (tudo na raiz)
const connectDB = require('./db');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const walletRoutes = require('./walletRoutes'); // Importado a Carteira
const kycRoutes = require('./kycRoutes');       // Importado o KYC
require('./cron'); // Inicia o Cron Job (Motor de Garantia 24h)

// Inicializa a aplicação Express
const app = express();

// Conectar ao Banco de Dados MongoDB
connectDB();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// === ROTAS DA API FLUXOMOZ ===
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/kyc', kycRoutes);

// Rota Base de Verificação
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API FluxoMoz operacional.',
        environment: process.env.NODE_ENV
    });
});

// Tratamento global para rotas não encontradas
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Rota não encontrada na API FluxoMoz.'
    });
});

// Inicialização do Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[FluxoMoz Server] Rodando na porta ${PORT}`);
});
