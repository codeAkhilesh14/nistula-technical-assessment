import express from 'express';
import { handleMessage } from '../controllers/messageController.js';
import validatePayload from '../middleware/validatePayload.js';

const router = express.Router();

router.post('/message', validatePayload, handleMessage);

export default router;
