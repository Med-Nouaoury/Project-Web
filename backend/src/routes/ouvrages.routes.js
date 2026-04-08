const router = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/ouvrages.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const canEdit   = authorize('editeur', 'gestionnaire', 'administrateur');
const clientOnly = authorize('client', 'editeur', 'gestionnaire', 'administrateur');

const ouvrageValidation = [
  body('titre').trim().notEmpty().withMessage('Le titre est requis.'),
  body('auteur').trim().notEmpty().withMessage('L\'auteur est requis.'),
  body('isbn').trim().notEmpty().withMessage('L\'ISBN est requis.'),
  body('prix').isFloat({ min: 0 }).withMessage('Le prix doit être positif.'),
  body('stock').isInt({ min: 0 }).withMessage('Le stock doit être >= 0.'),
  body('categorie_id').isInt().withMessage('Catégorie invalide.'),
];

// Public
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Gestion (éditeur/gestionnaire/admin)
router.post('/',    authenticate, canEdit, ouvrageValidation, validate, ctrl.create);
router.put('/:id',  authenticate, canEdit, ouvrageValidation, validate, ctrl.update);
router.delete('/:id', authenticate, canEdit, ctrl.remove);

// Avis — client connecté (vérif achat dans le controller)
router.post('/:id/avis',
  authenticate,
  clientOnly,
  [
    body('note').isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5.'),
  ],
  validate,
  ctrl.addAvis
);

// Commentaires — client connecté
router.post('/:id/commentaires',
  authenticate,
  [body('contenu').trim().notEmpty().withMessage('Le contenu est requis.')],
  validate,
  ctrl.addCommentaire
);

module.exports = router;
