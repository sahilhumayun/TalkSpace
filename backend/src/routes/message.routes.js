import express from 'express';
import { verfiyJWT } from '../middleware/auth.middleware.js';
import { getMessages,sendMessage, SideBarUsers } from '../controllers/message.controller.js';




const router = express.Router()

router.get('/users', verfiyJWT, SideBarUsers)
router.get('/:id', verfiyJWT , getMessages)
router.post('/send/:id', verfiyJWT,sendMessage)




export default router