const db = require('../config/db');

// POST /api/commandes — créer commande depuis le body (items frontend)
const create = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const client_id = req.user.id;
    const {
      adresse_livraison = 'Non spécifiée',
      mode_livraison = 'standard',
      mode_paiement = 'carte',
      lignes,
    } = req.body;

    let items = [];

    if (lignes && lignes.length > 0) {
      for (const ligne of lignes) {
        const [ouvrages] = await conn.query(
          'SELECT id, titre, stock, prix FROM ouvrages WHERE id = ?',
          [ligne.ouvrage_id]
        );
        if (ouvrages.length === 0) {
          await conn.rollback();
          return res.status(400).json({ message: `Ouvrage #${ligne.ouvrage_id} introuvable.` });
        }
        const o = ouvrages[0];
        if (o.stock < ligne.quantite) {
          await conn.rollback();
          return res.status(400).json({
            message: `Stock insuffisant pour "${o.titre}". Disponible : ${o.stock}.`
          });
        }
        items.push({
          ouvrage_id: ligne.ouvrage_id,
          quantite: ligne.quantite,
          prix_unitaire: ligne.prix_unitaire || o.prix,
          titre: o.titre,
          stock: o.stock,
        });
      }
    } else {
      const [paniers] = await conn.query(
        'SELECT * FROM panier WHERE client_id = ? AND actif = TRUE LIMIT 1',
        [client_id]
      );
      if (paniers.length === 0) {
        await conn.rollback();
        return res.status(400).json({ message: 'Aucun panier actif et aucune ligne fournie.' });
      }
      const [panierItems] = await conn.query(
        `SELECT pi.*, o.stock, o.titre FROM panier_items pi
         JOIN ouvrages o ON o.id = pi.ouvrage_id
         WHERE pi.panier_id = ?`,
        [paniers[0].id]
      );
      if (panierItems.length === 0) {
        await conn.rollback();
        return res.status(400).json({ message: 'Le panier est vide.' });
      }
      items = panierItems;
      await conn.query('UPDATE panier SET actif = FALSE WHERE id = ?', [paniers[0].id]);
    }

    for (const item of items) {
      await conn.query(
        'UPDATE ouvrages SET stock = stock - ? WHERE id = ?',
        [item.quantite, item.ouvrage_id]
      );
    }

    const total = items.reduce((s, i) => s + i.quantite * parseFloat(i.prix_unitaire), 0);

    const [result] = await conn.query(
      `INSERT INTO commandes
         (client_id, total, statut, adresse_livraison, mode_livraison, mode_paiement)
       VALUES (?,?,?,?,?,?)`,
      [client_id, total.toFixed(2), 'en_cours', adresse_livraison, mode_livraison, mode_paiement]
    );
    const commande_id = result.insertId;

    for (const item of items) {
      await conn.query(
        'INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES (?,?,?,?)',
        [commande_id, item.ouvrage_id, item.quantite, item.prix_unitaire]
      );
    }

    await conn.commit();

    res.status(201).json({
      message: 'Commande créée avec succès.',
      commande_id,
      total: total.toFixed(2),
      paiement_url: `https://paiement.simulation.com/pay?commande=${commande_id}`
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// GET /api/commandes — historique
const getAll = async (req, res, next) => {
  try {
    const isAdmin = ['administrateur', 'gestionnaire'].includes(req.user.role);
    let sql = `
      SELECT c.*,
             u.nom   AS client_nom,
             u.email AS client_email
      FROM commandes c
      LEFT JOIN users u ON u.id = c.client_id
    `;
    const params = [];

    if (!isAdmin) {
      sql += ' WHERE c.client_id = ?';
      params.push(req.user.id);
    }
    sql += ' ORDER BY c.created_at DESC';

    const [rows] = await db.query(sql, params);

    const formatted = rows.map((r) => ({
      ...r,
      utilisateur: {
        prenom: r.client_nom,
        nom: r.client_nom,
        email: r.client_email,
      },
    }));

    res.json(formatted);
  } catch (err) { next(err); }
};

// GET /api/commandes/:id — détail
const getOne = async (req, res, next) => {
  try {
    const [commandes] = await db.query('SELECT * FROM commandes WHERE id = ?', [req.params.id]);
    if (commandes.length === 0) return res.status(404).json({ message: 'Commande introuvable.' });

    const commande = commandes[0];
    const isOwner = commande.client_id === req.user.id;
    const isAdmin = ['administrateur', 'gestionnaire'].includes(req.user.role);

    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Accès refusé.' });

    const [items] = await db.query(
      `SELECT ci.*, o.titre, o.auteur FROM commande_items ci
       LEFT JOIN ouvrages o ON o.id = ci.ouvrage_id
       WHERE ci.commande_id = ?`,
      [req.params.id]
    );
    res.json({ ...commande, items });
  } catch (err) { next(err); }
};

// PUT /api/commandes/:id/status — admin/gestionnaire
const updateStatus = async (req, res, next) => {
  try {
    const { statut } = req.body;
    const validStatuts = ['en_cours', 'payee', 'annulee', 'expediee', 'livree'];
    if (!validStatuts.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }
    const [result] = await db.query(
      'UPDATE commandes SET statut = ? WHERE id = ?', [statut, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Commande introuvable.' });
    res.json({ message: 'Statut mis à jour.' });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getOne, updateStatus };