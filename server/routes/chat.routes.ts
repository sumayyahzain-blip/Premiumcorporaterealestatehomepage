
import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { rbacGuard } from '../middleware/rbacGuard';

const router = Router();

// Public chat or protected?
// Let's protect it so only logged in users can chat for now, or use optional auth.
// Using rbacGuard() with no args implies "Any Authenticated User"
router.post('/message', rbacGuard(), (req, res) => chatController.sendMessage(req, res));

export default router;
