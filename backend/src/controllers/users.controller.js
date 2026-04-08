const db = require('../config/db');

// GET /api/users/me
const getMe = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nom, email, role, actif, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// GET /api/users — admin seulement
const getAll = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nom, email, role, actif, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// PUT /api/users/:id — admin ou owner
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isOwner = req.user.id === parseInt(id);
    const isAdmin = req.user.role === 'administrateur';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    const { nom, email } = req.body;
    await db.query('UPDATE users SET nom = ?, email = ? WHERE id = ?', [nom, email, id]);
    res.json({ message: 'Profil mis à jour.' });
  } catch (err) { next(err); }
};

// PUT /api/users/:id/actif — admin seulement
const toggleActif = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { actif } = req.body;
    await db.query('UPDATE users SET actif = ? WHERE id = ?', [actif, id]);
    res.json({ message: `Utilisateur ${actif ? 'activé' : 'désactivé'}.` });
  } catch (err) { next(err); }
};

module.exports = { getMe, getAll, update, toggleActif };
