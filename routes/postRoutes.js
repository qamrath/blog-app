import express from 'express';
import { getAllPosts,createPost, updatePost, deletePost } from '../controllers/postController.js';
import {authMiddleware} from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/get', getAllPosts);
//router.get('/:id', getPostById);

router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router; 
