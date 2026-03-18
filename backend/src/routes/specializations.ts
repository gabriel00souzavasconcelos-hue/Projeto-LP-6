import { Router } from 'express';
import { specializationController } from '../controllers/specializationController';
import { authenticate, requireClinica } from '../middlewares/authMiddleware';

const router = Router();

// Leitura pública — qualquer um pode ver as especializações disponíveis
router.get('/', specializationController.getAllSpecializations.bind(specializationController));

// Escrita privada — apenas clínicas autenticadas
router.post('/',          authenticate, requireClinica, specializationController.createSpecialization.bind(specializationController));
router.delete('/:codigo', authenticate, requireClinica, specializationController.deleteSpecialization.bind(specializationController));

export default router;