const router  = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/commentaires.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

router.get('/',
  authenticate,
  authorize('editeur', 'gestionnaire', 'administrateur'),
  ctrl.getPending
);

router.put('/:id/valider',
  authenticate,
  authorize('editeur', 'gestionnaire', 'administrateur'),
  [body('valide').isBoolean().withMessage('valide doit être true ou false.')],
  validate,
  ctrl.valider
);

module.exports = router;
