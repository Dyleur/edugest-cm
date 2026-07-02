const app = require('./src/app');
const sequelize = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connexion MySQL établie avec succès');

    await sequelize.sync({ force: false });
    console.log('Tables synchronisées');

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur de démarrage :', error.message);
    process.exit(1);
  }
}

startServer();
