const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./src/config/database');
const { setupSocket } = require('./src/socket/handler');
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupSocket(io);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connexion MySQL établie avec succès');
    await sequelize.sync({ force: false });
    console.log('Tables synchronisées');
    server.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur de démarrage :', error.message);
    process.exit(1);
  }
}

startServer();
