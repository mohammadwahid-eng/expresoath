import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/me', AuthMiddleware, (req, res) => {
  return res.status(200).json(req.user);
})

export default router;