const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importações ajustadas para a raiz
const connectDB = require('./config'); 
const authRoutes = require('./auth_routes'); 
const productRoutes = require('./product_routes'); 
const walletRoutes = require('./wallet_routes'); 
const orderRoutes = require('./order_routes'); // Nova rota de vendas integrada
const startCronJobs = require('./cron_jobs'); // Automação financeira integrada

// 1. Carregar variáveis de ambiente do .env
dotenv.config();

// 2. Inicializar o Express
const app = express();

// 3. Conectar ao MongoDB Atlas
connectDB();

// 3.5 Inicializar o robô financeiro (Cron Jobs)
startCronJobs();

// 4. Middlewares Globais de Segurança e Comunicação
app.use(cors());
app.use(express.json()); // Habilita o parse de JSON no corpo das requisições

// 5. Rotas da API FluxoMoz
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/wallet', walletRoutes); 
app.use('/api/orders', orderRoutes); // Acoplado o motor de checkout e pedidos

// 6. Rota Base de Diagnóstico (Apenas para testar se a API está online)
app.get('/', (req, res) => {
    res.status(200).json({
        status: "Online",
        plataforma: "FluxoMoz API",
        mensagem: "Infraestrutura SaaS de pagamentos operando corretamente."
    });
});

// 7. Configuração da Porta de Execução
const PORT = process.env.PORT || 5000;

// 8. Lançar o Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor FluxoMoz rodando na porta ${PORT}`);
    console.log(` Escopo de ambiente: [${process.env.NODE_ENV}]`);
});
