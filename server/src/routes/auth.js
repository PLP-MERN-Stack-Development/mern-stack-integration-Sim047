
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { runValidation } = require('../middleware/runValidation');
router.post('/register', registerValidator, runValidation, register);
router.post('/login', loginValidator, runValidation, login);
module.exports = router;
