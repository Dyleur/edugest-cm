const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'EduGest CM API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EduGest CM API is running', version: '1.0.0' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/annees', require('./routes/annee.routes'));
app.use('/api/cycles', require('./routes/cycle.routes'));
app.use('/api/classes', require('./routes/classe.routes'));
app.use('/api/eleves', require('./routes/eleve.routes'));
app.use('/api/enseignants', require('./routes/enseignant.routes'));
app.use('/api/inscriptions', require('./routes/inscription.routes'));
app.use('/api/presences', require('./routes/presence.routes'));
app.use('/api/parents', require('./routes/parents.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

module.exports = app;
