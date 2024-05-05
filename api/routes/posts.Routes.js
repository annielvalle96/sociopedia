import express from 'express'
import { getPosts, getUserPosts, likePost } from '../controllers/posts.Controllers.js'
import { verifyToken } from '../middleware/auth.Middleware.js'

const router = express.Router()

/* READ */
router.get('/', verifyToken, getPosts)
router.get('/:userId/posts', verifyToken, getUserPosts)

/* UPDATE */
router.patch('/:id/like', verifyToken, likePost)

export default router
