
const { body } = require('express-validator');
exports.postValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
];
