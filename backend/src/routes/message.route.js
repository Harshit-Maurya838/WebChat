import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getMessage, getUserFrSidebar, sendMessage } from '../controllers/message.controller.js';
const router = express.Router();

router.get('/users', protectRoute, getUserFrSidebar)
router.get('/:id', protectRoute, getMessage)
router.post('/send/:id', protectRoute, sendMessage)

export default router;