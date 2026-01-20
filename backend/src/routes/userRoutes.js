import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Listar usuários (TODO: Adicionar middleware de auth/admin)
router.get('/', userController.listUsers.bind(userController));

// Alterar status de bloqueio
router.patch('/:uid/status', userController.toggleBlockStatus.bind(userController));

// Resetar senha e bloquear
router.post('/reset-password', userController.resetPasswordAndBlock.bind(userController));

export default router;
