require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const { syncDB } = require('./src/models/index');

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB();  // 1. Connexion PostgreSQL
  await syncDB();     // 2. Création des tables
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}/api`);
    console.log(`📋 Health check : http://localhost:${PORT}/api/health`);
  });
};

startServer();