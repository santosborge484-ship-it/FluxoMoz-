require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importações locais
const connectDB = require('./db');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const walletRoutes = require('./walletRoutes'); 
const kycRoutes = require('./kycRoutes');       
const dashboardRoutes = require('./dashboardRoutes'); // NOVO: Módulo do Dashboard
require('./cron'); 

// Inicializa a aplicação Express
const app = express();

// Conectar ao Banco de Dados MongoDB
connectDB();

// Middlewares Globais - LIMITE ALARGADO PARA 50MB (Para suportar as fotos KYC)
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// === ROTAS DA API FLUXOMOZ ===
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/dashboard', dashboardRoutes); // NOVO: Rota do Dashboard ativa

// Rota Base de Verificação
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API FluxoMoz operacional e blindada.',
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
