const db = require('../config/db');

// Récupère ou crée le panier actif du client
const getPanierActif = async (client_id) => {
  const [rows] = await db.query(
    'SELECT * FROM panier WHERE client_id = ? AND actif = TRUE LIMIT 1',
    [client_id]
  );
  if (rows.length > 0) return rows[0];

  const [result] = await db.query(
    'INSERT INTO panier (client_id, actif) VALUES (?, TRUE)',
    [client_id]
  );
  return { id: result.insertId, client_id, actif: true };
};

// GET /api/panier
const getPanier = async (req, res, next) => {
  try {
    const panier = await getPanierActif(req.user.id);
    const [items] = await db.query(
      `SELECT pi.id, pi.quantite, pi.prix_unitaire,
              o.id AS ouvrage_id, o.titre, o.auteur, o.stock
       FROM panier_items pi
       JOIN ouvrages o ON o.id = pi.ouvrage_id
       WHERE pi.panier_id = ?`,
      [panier.id]
    );
    const total = items.reduce((sum, i) => sum + i.quantite * i.prix_unitaire, 0);
    res.json({ panier_id: panier.id, items, total: total.toFixed(2) });
  } catch (err) { next(err); }
};

// POST /api/panier/items
const addItem = async (req, res, next) => {
  try {
    const { ouvrage_id, quantite = 1 } = req.body;
    const panier = await getPanierActif(req.user.id);

    const [ouvrages] = await db.query(
      'SELECT prix, stock FROM ouvrages WHERE id = ?', [ouvrage_id]
    );
    if (ouvrages.length === 0) return res.status(404).json({ message: 'Ouvrage introuvable.' });

    const { prix, stock } = ouvrages[0];
    if (stock < quantite) return res.status(400).json({ message: 'Stock insuffisant.' });

    // Si l'item existe déjà, on incrémente
    const [existing] = await db.query(
      'SELECT id, quantite FROM panier_items WHERE panier_id = ? AND ouvrage_id = ?',
      [panier.id, ouvrage_id]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE panier_items SET quantite = quantite + ? WHERE id = ?',
        [quantite, existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (?,?,?,?)',
        [panier.id, ouvrage_id, quantite, prix]
      );
    }

    res.status(201).json({ message: 'Article ajouté au panier.' });
  } catch (err) { next(err); }
};

// PUT /api/panier/items/:id
const updateItem = async (req, res, next) => {
  try {
    const { quantite } = req.body;
    if (quantite <= 0) {
      await db.query('DELETE FROM panier_items WHERE id = ?', [req.params.id]);
      return res.json({ message: 'Article retiré du panier.' });
    }
    await db.query('UPDATE panier_items SET quantite = ? WHERE id = ?', [quantite, req.params.id]);
    res.json({ message: 'Quantité mise à jour.' });
  } catch (err) { next(err); }
};

// DELETE /api/panier/items/:id
const removeItem = async (req, res, next) => {
  try {
    await db.query('DELETE FROM panier_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Article retiré du panier.' });
  } catch (err) { next(err); }
};

module.exports = { getPanier, addItem, updateItem, removeItem };
