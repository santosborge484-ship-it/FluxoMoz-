const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`=========================================`);
        console.log(` MongoDB Conectado: ${conn.connection.host}`);
        console.log(` Base de Dados: FluxoMoz Ativa`);
        console.log(`=========================================`);
    } catch (error) {
        console.error(`❌ Erro crítico de conexão no MongoDB: ${error.message}`);
        // Fecha a aplicação imediatamente se o banco falhar
        process.exit(1);
    }
};

module.exports = connectDB;
