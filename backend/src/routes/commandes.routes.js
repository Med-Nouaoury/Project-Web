const router  = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/commandes.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

router.post('/',
  authenticate,
  [body('adresse_livraison').trim().notEmpty().withMessage('L\'adresse de livraison est requise.')],
  validate,
  ctrl.create
);

router.get('/',    authenticate, ctrl.getAll);
router.get('/:id', authenticate, ctrl.getOne);

router.put('/:id/status',
  authenticate,
  authorize('administrateur', 'gestionnaire'),
  [body('statut').isIn(['en_cours','payee','annulee','expediee']).withMessage('Statut invalide.')],
  validate,
  ctrl.updateStatus
);

module.exports = router;
