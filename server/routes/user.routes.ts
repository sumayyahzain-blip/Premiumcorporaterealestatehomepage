
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { rbacGuard } from '../middleware/rbacGuard';

const router = Router();

// Protect all user routes
// Mapping 'SUPER_ADMIN', 'OPS_ADMIN' from request to 'super_admin', 'operations_admin' in DB
router.get('/', rbacGuard(['super_admin', 'operations_admin']), (req, res) => userController.listUsers(req, res));
router.get('/:id', rbacGuard(['super_admin', 'operations_admin']), (req, res) => userController.getUser(req, res));

export default router;
