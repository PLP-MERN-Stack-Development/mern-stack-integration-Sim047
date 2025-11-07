
const express = require('express');
const router = express.Router();
const { getAll, create } = require('../controllers/categoriesController');
const { body } = require('express-validator');
const { runValidation } = require('../middleware/runValidation');
router.get('/', getAll);
router.post('/', [ body('name').notEmpty().withMessage('Name required') ], runValidation, create);
module.exports = router;
