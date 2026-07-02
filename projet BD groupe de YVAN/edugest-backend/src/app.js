require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EduGest CM API is running', version: '1.0.0' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/annees', require('./routes/annee.routes'));
app.use('/api/trimestres', require('./routes/trimestre.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/cycles', require('./routes/cycle.routes'));
app.use('/api/classes', require('./routes/classe.routes'));
app.use('/api/salles', require('./routes/salle.routes'));
app.use('/api/eleves', require('./routes/eleve.routes'));
app.use('/api/enseignants', require('./routes/enseignant.routes'));
app.use('/api/cours', require('./routes/cours.routes'));
app.use('/api/nature-epreuves', require('./routes/natureEpreuves'));
app.use('/api/epreuves', require('./routes/epreuves'));
app.use('/api/evaluations', require('./routes/evaluations'));
app.use('/api/bulletins', require('./routes/bulletins'));
app.use('/api/emploidutemps', require('./routes/edt.routes'));
app.use('/api/presences', require('./routes/presence.routes'));
app.use('/api/inscriptions', require('./routes/inscription.routes'));
app.use('/api/scolarites', require('./routes/scolarite.routes'));
app.use('/api/modes', require('./routes/mode.routes'));
app.use('/api/paiements', require('./routes/paiement.routes'));
app.use('/api/discipline', require('./routes/discipline.routes'));
app.use('/api/rapports', require('./routes/rapport.routes'));
app.use('/api/messages', require('./routes/messages'));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    timestamp: new Date().toISOString(), status,
    message: err.message || 'Erreur serveur interne',
    path: req.path
  });
});

module.exports = app;
