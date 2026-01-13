import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { rbacGuard } from '../middleware/rbacGuard';

const router = Router();
const controller = new PropertyController();

// Public Routes
router.get('/', (req, res) => controller.listProperties(req, res));
router.get('/:id', (req, res) => controller.getPropertyById(req, res));

// Protected Routes
router.post('/', rbacGuard(), (req, res) => controller.createProperty(req, res));
router.patch('/:id', rbacGuard(), (req, res) => controller.updateProperty(req, res));
router.delete('/:id', rbacGuard(), (req, res) => controller.deleteProperty(req, res));

export default router;
