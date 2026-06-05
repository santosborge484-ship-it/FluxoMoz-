const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Conexão segura ao MongoDB utilizando a variável de ambiente
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`[FluxoMoz DB] Conectado com sucesso: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Erro Crítico DB] Falha na conexão: ${error.message}`);
        // Interrompe o processo imediatamente para proteger o sistema
        process.exit(1); 
    }
};

module.exports = connectDB;
