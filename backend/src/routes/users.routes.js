const router = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

router.get('/me',  authenticate, ctrl.getMe);
router.get('/',    authenticate, authorize('administrateur'), ctrl.getAll);
router.put('/:id', authenticate,
  [body('nom').trim().notEmpty(), body('email').isEmail().normalizeEmail()],
  validate,
  ctrl.update
);
router.put('/:id/actif',
  authenticate,
  authorize('administrateur'),
  [body('actif').isBoolean()],
  validate,
  ctrl.toggleActif
);

module.exports = router;
