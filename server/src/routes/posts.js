
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const postsController = require('../controllers/postsController');
const { postValidator } = require('../validators/postValidator');
const { runValidation } = require('../middleware/runValidation');
const auth = require('../middleware/authMiddleware');
router.get('/', postsController.getAll);
router.get('/:id', postsController.getOne);
router.post('/', auth, upload.single('featuredImage'), postValidator, runValidation, postsController.create);
router.put('/:id', auth, upload.single('featuredImage'), postValidator, runValidation, postsController.update);
router.delete('/:id', auth, postsController.remove);
router.post('/:id/comments', postsController.addComment);
module.exports = router;
