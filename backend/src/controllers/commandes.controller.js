const db = require('../config/db');

// POST /api/commandes — créer commande depuis le panier actif (transactionnel)
const create = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const client_id = req.user.id;
    const { adresse_livraison, mode_livraison = 'standard', mode_paiement = 'carte' } = req.body;

    // Récupérer le panier actif
    const [paniers] = await conn.query(
      'SELECT * FROM panier WHERE client_id = ? AND actif = TRUE LIMIT 1',
      [client_id]
    );
    if (paniers.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Aucun panier actif.' });
    }
    const panier = paniers[0];

    // Récupérer les items du panier
    const [items] = await conn.query(
      `SELECT pi.*, o.stock, o.titre FROM panier_items pi
       JOIN ouvrages o ON o.id = pi.ouvrage_id
       WHERE pi.panier_id = ?`,
      [panier.id]
    );
    if (items.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Le panier est vide.' });
    }

    // Vérifier le stock et décrémenter (règle métier critique)
    for (const item of items) {
      if (item.stock < item.quantite) {
        await conn.rollback();
        return res.status(400).json({
          message: `Stock insuffisant pour "${item.titre}". Disponible : ${item.stock}.`
        });
      }
      await conn.query(
        'UPDATE ouvrages SET stock = stock - ? WHERE id = ?',
        [item.quantite, item.ouvrage_id]
      );
    }

    // Calculer le total
    const total = items.reduce((s, i) => s + i.quantite * parseFloat(i.prix_unitaire), 0);

    // Créer la commande
    const [result] = await conn.query(
      `INSERT INTO commandes
         (client_id, total, statut, adresse_livraison, mode_livraison, mode_paiement)
       VALUES (?,?,?,?,?,?)`,
      [client_id, total.toFixed(2), 'en_cours', adresse_livraison, mode_livraison, mode_paiement]
    );
    const commande_id = result.insertId;

    // Insérer les commande_items
    for (const item of items) {
      await conn.query(
        'INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES (?,?,?,?)',
        [commande_id, item.ouvrage_id, item.quantite, item.prix_unitaire]
      );
    }

    // Désactiver le panier
    await conn.query('UPDATE panier SET actif = FALSE WHERE id = ?', [panier.id]);

    await conn.commit();

    res.status(201).json({
      message: 'Commande créée avec succès.',
      commande_id,
      total: total.toFixed(2),
      // Simulation URL de paiement
      paiement_url: `https://paiement.simulation.com/pay?commande=${commande_id}`
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// GET /api/commandes — historique du client connecté
const getAll = async (req, res, next) => {
  try {
    const isAdmin = ['administrateur', 'gestionnaire'].includes(req.user.role);
    let sql = 'SELECT * FROM commandes';
    const params = [];

    if (!isAdmin) {
      sql += ' WHERE client_id = ?';
      params.push(req.user.id);
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};

// GET /api/commandes/:id — détail
const getOne = async (req, res, next) => {
  try {
    const [commandes] = await db.query('SELECT * FROM commandes WHERE id = ?', [req.params.id]);
    if (commandes.length === 0) return res.status(404).json({ message: 'Commande introuvable.' });

    const commande = commandes[0];
    const isOwner  = commande.client_id === req.user.id;
    const isAdmin  = ['administrateur', 'gestionnaire'].includes(req.user.role);

    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Accès refusé.' });

    const [items] = await db.query(
      `SELECT ci.*, o.titre, o.auteur FROM commande_items ci
       JOIN ouvrages o ON o.id = ci.ouvrage_id
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
    const validStatuts = ['en_cours', 'payee', 'annulee', 'expediee'];
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
