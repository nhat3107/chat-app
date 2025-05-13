import express from 'express';
import { blockUser } from '../controllers/block.controller.js';

const router = express.Router();

router.post('/block', blockUser);

export default router;