const router = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');

router.post('/register',
  [
    body('nom').trim().notEmpty().withMessage('Le nom est requis.'),
    body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  ],
  validate,
  ctrl.register
);

router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  ctrl.login
);

module.exports = router;
