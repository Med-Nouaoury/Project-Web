const db = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY nom');
    res.json(rows);
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Catégorie introuvable.' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { nom, description } = req.body;
    const [result] = await db.query(
      'INSERT INTO categories (nom, description) VALUES (?,?)', [nom, description]
    );
    res.status(201).json({ message: 'Catégorie créée.', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Ce nom de catégorie existe déjà.' });
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { nom, description } = req.body;
    const [result] = await db.query(
      'UPDATE categories SET nom=?, description=? WHERE id=?', [nom, description, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Catégorie introuvable.' });
    res.json({ message: 'Catégorie mise à jour.' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM categories WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Catégorie introuvable.' });
    res.json({ message: 'Catégorie supprimée.' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
