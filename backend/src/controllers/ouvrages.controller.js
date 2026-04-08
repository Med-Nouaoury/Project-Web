const db = require('../config/db');

// GET /api/ouvrages — public, stock > 0, filtres
const getAll = async (req, res, next) => {
  try {
    const { q, categorie_id, sort } = req.query;
    let sql = `
      SELECT o.*, c.nom AS categorie_nom,
             COALESCE(AVG(a.note), 0) AS note_moyenne,
             COUNT(DISTINCT a.id) AS nb_avis
      FROM ouvrages o
      LEFT JOIN categories c ON c.id = o.categorie_id
      LEFT JOIN avis a ON a.ouvrage_id = o.id
      WHERE o.stock > 0
    `;
    const params = [];

    if (q) {
      sql += ' AND (o.titre LIKE ? OR o.auteur LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }
    if (categorie_id) {
      sql += ' AND o.categorie_id = ?';
      params.push(categorie_id);
    }

    sql += ' GROUP BY o.id';

    if (sort === 'popularite') sql += ' ORDER BY nb_avis DESC';
    else if (sort === 'prix_asc') sql += ' ORDER BY o.prix ASC';
    else if (sort === 'prix_desc') sql += ' ORDER BY o.prix DESC';
    else sql += ' ORDER BY o.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};

// GET /api/ouvrages/:id — détail + avis validés
const getOne = async (req, res, next) => {
  try {
    const [ouvrages] = await db.query(
      `SELECT o.*, c.nom AS categorie_nom FROM ouvrages o
       LEFT JOIN categories c ON c.id = o.categorie_id
       WHERE o.id = ?`,
      [req.params.id]
    );
    if (ouvrages.length === 0) return res.status(404).json({ message: 'Ouvrage introuvable.' });

    const [avis] = await db.query(
      `SELECT a.id, a.note, a.commentaire, a.date, u.nom AS client_nom
       FROM avis a JOIN users u ON u.id = a.client_id
       WHERE a.ouvrage_id = ? ORDER BY a.date DESC`,
      [req.params.id]
    );

    const [commentaires] = await db.query(
      `SELECT c.id, c.contenu, c.date_soumission, u.nom AS client_nom
       FROM commentaires c JOIN users u ON u.id = c.client_id
       WHERE c.ouvrage_id = ? AND c.valide = TRUE ORDER BY c.date_soumission DESC`,
      [req.params.id]
    );

    res.json({ ...ouvrages[0], avis, commentaires });
  } catch (err) { next(err); }
};

// POST /api/ouvrages — gestionnaire ou éditeur
const create = async (req, res, next) => {
  try {
    const { titre, auteur, isbn, description, prix, stock, categorie_id } = req.body;
    const [result] = await db.query(
      'INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id) VALUES (?,?,?,?,?,?,?)',
      [titre, auteur, isbn, description, prix, stock, categorie_id]
    );
    res.status(201).json({ message: 'Ouvrage créé.', id: result.insertId });
  } catch (err) { next(err); }
};

// PUT /api/ouvrages/:id
const update = async (req, res, next) => {
  try {
    const { titre, auteur, isbn, description, prix, stock, categorie_id } = req.body;
    const [result] = await db.query(
      'UPDATE ouvrages SET titre=?, auteur=?, isbn=?, description=?, prix=?, stock=?, categorie_id=? WHERE id=?',
      [titre, auteur, isbn, description, prix, stock, categorie_id, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Ouvrage introuvable.' });
    res.json({ message: 'Ouvrage mis à jour.' });
  } catch (err) { next(err); }
};

// DELETE /api/ouvrages/:id
const remove = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM ouvrages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Ouvrage introuvable.' });
    res.json({ message: 'Ouvrage supprimé.' });
  } catch (err) { next(err); }
};

// POST /api/ouvrages/:id/avis — client, vérif achat obligatoire
const addAvis = async (req, res, next) => {
  try {
    const ouvrage_id = req.params.id;
    const client_id  = req.user.id;

    // Règle métier : vérifier que le client a acheté cet ouvrage
    const [achat] = await db.query(
      `SELECT ci.id FROM commande_items ci
       JOIN commandes c ON c.id = ci.commande_id
       WHERE c.client_id = ? AND ci.ouvrage_id = ? AND c.statut IN ('payee','expediee')
       LIMIT 1`,
      [client_id, ouvrage_id]
    );
    if (achat.length === 0) {
      return res.status(403).json({ message: 'Vous devez avoir acheté cet ouvrage pour laisser un avis.' });
    }

    const { note, commentaire } = req.body;
    await db.query(
      'INSERT INTO avis (client_id, ouvrage_id, note, commentaire) VALUES (?,?,?,?)',
      [client_id, ouvrage_id, note, commentaire || null]
    );
    res.status(201).json({ message: 'Avis ajouté.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Vous avez déjà laissé un avis pour cet ouvrage.' });
    }
    next(err);
  }
};

// POST /api/ouvrages/:id/commentaires — client
const addCommentaire = async (req, res, next) => {
  try {
    const { contenu } = req.body;
    await db.query(
      'INSERT INTO commentaires (client_id, ouvrage_id, contenu, valide) VALUES (?,?,?,FALSE)',
      [req.user.id, req.params.id, contenu]
    );
    res.status(201).json({ message: 'Commentaire soumis. Il sera visible après validation.' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove, addAvis, addCommentaire };
