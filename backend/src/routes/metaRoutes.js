import express from 'express';
import { getCategories, getTags, createTag, deleteTag } from '../controllers/metaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/categories', getCategories);

router.get('/tags', getTags);
router.post('/tags', createTag);
router.delete('/tags/:id', deleteTag);

export default router;
