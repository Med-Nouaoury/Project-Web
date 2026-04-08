const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// POST /api/listes — créer une liste de cadeaux
const create = async (req, res, next) => {
  try {
    const { nom } = req.body;
    const code_partage = uuidv4().replace(/-/g, '').substring(0, 20);
    const [result] = await db.query(
      'INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage) VALUES (?,?,?)',
      [nom, req.user.id, code_partage]
    );
    res.status(201).json({ message: 'Liste créée.', id: result.insertId, code_partage });
  } catch (err) { next(err); }
};

// GET /api/listes/:code — consulter par code (public/ami)
const getByCode = async (req, res, next) => {
  try {
    const [listes] = await db.query(
      'SELECT * FROM listes_cadeaux WHERE code_partage = ?', [req.params.code]
    );
    if (listes.length === 0) return res.status(404).json({ message: 'Liste introuvable.' });

    const [items] = await db.query(
      `SELECT li.id, li.quantite_souhaitee, o.id AS ouvrage_id,
              o.titre, o.auteur, o.prix, o.stock
       FROM liste_items li
       JOIN ouvrages o ON o.id = li.ouvrage_id
       WHERE li.liste_id = ?`,
      [listes[0].id]
    );
    res.json({ ...listes[0], items });
  } catch (err) { next(err); }
};

// POST /api/listes/:id/items — ajouter un ouvrage à la liste
const addItem = async (req, res, next) => {
  try {
    const { ouvrage_id, quantite_souhaitee = 1 } = req.body;
    const liste_id = req.params.id;

    // Vérifier que c'est bien le propriétaire
    const [listes] = await db.query('SELECT * FROM listes_cadeaux WHERE id = ?', [liste_id]);
    if (listes.length === 0) return res.status(404).json({ message: 'Liste introuvable.' });
    if (listes[0].proprietaire_id !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    await db.query(
      'INSERT INTO liste_items (liste_id, ouvrage_id, quantite_souhaitee) VALUES (?,?,?)',
      [liste_id, ouvrage_id, quantite_souhaitee]
    );
    res.status(201).json({ message: 'Article ajouté à la liste.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Cet ouvrage est déjà dans la liste.' });
    next(err);
  }
};

// POST /api/listes/:id/acheter — achat direct depuis la liste
const acheter = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { ouvrage_id, adresse_livraison } = req.body;
    const client_id = req.user.id;

    // Récupérer l'item
    const [items] = await conn.query(
      `SELECT li.quantite_souhaitee, o.prix, o.stock, o.titre
       FROM liste_items li JOIN ouvrages o ON o.id = li.ouvrage_id
       WHERE li.liste_id = ? AND li.ouvrage_id = ?`,
      [req.params.id, ouvrage_id]
    );
    if (items.length === 0) return res.status(404).json({ message: 'Article introuvable dans la liste.' });

    const item = items[0];
    if (item.stock < 1) {
      await conn.rollback();
      return res.status(400).json({ message: `Stock insuffisant pour "${item.titre}".` });
    }

    // Décrémenter stock
    await conn.query('UPDATE ouvrages SET stock = stock - 1 WHERE id = ?', [ouvrage_id]);

    // Créer commande
    const [result] = await conn.query(
      'INSERT INTO commandes (client_id, total, statut, adresse_livraison, mode_paiement) VALUES (?,?,?,?,?)',
      [client_id, item.prix, 'en_cours', adresse_livraison, 'carte']
    );
    await conn.query(
      'INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES (?,?,1,?)',
      [result.insertId, ouvrage_id, item.prix]
    );

    await conn.commit();
    res.status(201).json({ message: 'Achat effectué depuis la liste.', commande_id: result.insertId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

module.exports = { create, getByCode, addItem, acheter };
