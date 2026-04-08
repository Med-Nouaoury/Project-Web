const router  = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/panier.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

router.get('/',             authenticate, ctrl.getPanier);
router.post('/items',       authenticate,
  [body('ouvrage_id').isInt(), body('quantite').optional().isInt({ min: 1 })],
  validate,
  ctrl.addItem
);
router.put('/items/:id',    authenticate,
  [body('quantite').isInt({ min: 0 })],
  validate,
  ctrl.updateItem
);
router.delete('/items/:id', authenticate, ctrl.removeItem);

module.exports = router;
