require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Inicializa a aplicação Express
const app = express();

// Conectar ao Banco de Dados MongoDB
connectDB();

// Middlewares Globais
// Permite requisições do frontend e converte corpos de requisição para JSON leve
app.use(cors());
app.use(express.json());

// Rota Base de Verificação de Saúde do Sistema (Health Check)
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API FluxoMoz operacional.',
        environment: process.env.NODE_ENV
    });
});

// Tratamento global para rotas não encontradas (Segurança)
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
