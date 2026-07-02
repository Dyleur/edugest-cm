require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EduGest CM API is running', version: '1.0.0' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/nature-epreuves', require('./routes/natureEpreuves'));
app.use('/api/epreuves', require('./routes/epreuves'));
app.use('/api/evaluations', require('./routes/evaluations'));
app.use('/api/bulletins', require('./routes/bulletins'));
app.use('/api/messages', require('./routes/messages'));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    message: err.message || 'Erreur serveur interne',
    path: req.path
  });
});

module.exports = app;