const db = require('../config/db');

// GET /api/commentaires — liste des commentaires en attente (éditeur)
const getPending = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.nom AS client_nom, o.titre AS ouvrage_titre
       FROM commentaires c
       JOIN users u ON u.id = c.client_id
       JOIN ouvrages o ON o.id = c.ouvrage_id
       WHERE c.valide = FALSE
       ORDER BY c.date_soumission ASC`
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// PUT /api/commentaires/:id/valider — éditeur valide ou rejette
const valider = async (req, res, next) => {
  try {
    const { valide } = req.body; // true ou false
    const valideur_id = req.user.id;

    if (valide) {
      await db.query(
        `UPDATE commentaires
         SET valide = TRUE, date_validation = NOW(), valide_par = ?
         WHERE id = ?`,
        [valideur_id, req.params.id]
      );
      return res.json({ message: 'Commentaire validé.' });
    } else {
      // Rejeter = supprimer
      await db.query('DELETE FROM commentaires WHERE id = ?', [req.params.id]);
      return res.json({ message: 'Commentaire rejeté et supprimé.' });
    }
  } catch (err) { next(err); }
};

module.exports = { getPending, valider };
