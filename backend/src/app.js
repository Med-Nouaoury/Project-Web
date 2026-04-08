require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

// ── Middlewares globaux ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth.routes'));
app.use('/api/users',        require('./routes/users.routes'));
app.use('/api/categories',   require('./routes/categories.routes'));
app.use('/api/ouvrages',     require('./routes/ouvrages.routes'));
app.use('/api/panier',       require('./routes/panier.routes'));
app.use('/api/commandes',    require('./routes/commandes.routes'));
app.use('/api/listes',       require('./routes/listes.routes'));
app.use('/api/commentaires', require('./routes/commentaires.routes'));

// ── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable.' });
});

// ── Gestion centralisée des erreurs ─────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Erreur serveur.' });
});

// ── Démarrage ───────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅  Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app;
