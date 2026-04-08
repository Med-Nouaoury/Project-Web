const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

const SALT_ROUNDS = 10;

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { nom, email, password } = req.body;

    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.query(
      'INSERT INTO users (nom, email, password_hash) VALUES (?, ?, ?)',
      [nom, email, password_hash]
    );

    res.status(201).json({ message: 'Compte créé avec succès.', userId: result.insertId });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const user = rows[0];

    if (!user.actif) {
      return res.status(403).json({ message: 'Compte désactivé. Contactez l\'administrateur.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, nom: user.nom },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
