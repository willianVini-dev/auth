import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/token', refresh);
router.delete('/logout', logout);
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Olá, ${req.user.username}! Esta é uma rota protegida.` });
});

export default router;