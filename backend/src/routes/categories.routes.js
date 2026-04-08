const router = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/categories.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const canEdit = authorize('editeur', 'gestionnaire', 'administrateur');

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getOne);
router.post('/',    authenticate, canEdit, [body('nom').trim().notEmpty()], validate, ctrl.create);
router.put('/:id',  authenticate, canEdit, [body('nom').trim().notEmpty()], validate, ctrl.update);
router.delete('/:id', authenticate, canEdit, ctrl.remove);

module.exports = router;
