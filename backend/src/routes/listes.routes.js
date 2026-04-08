const router  = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/listes.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

router.post('/',
  authenticate,
  [body('nom').trim().notEmpty().withMessage('Le nom de la liste est requis.')],
  validate,
  ctrl.create
);

router.get('/:code', ctrl.getByCode);

router.post('/:id/items',
  authenticate,
  [body('ouvrage_id').isInt(), body('quantite_souhaitee').optional().isInt({ min: 1 })],
  validate,
  ctrl.addItem
);

router.post('/:id/acheter',
  authenticate,
  [
    body('ouvrage_id').isInt(),
    body('adresse_livraison').trim().notEmpty().withMessage('Adresse requise.')
  ],
  validate,
  ctrl.acheter
);

module.exports = router;
