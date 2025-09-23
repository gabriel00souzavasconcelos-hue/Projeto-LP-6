import { Router } from 'express';
import { specializationController } from '../controllers/specializationController';

const router = Router();

router.get('/', specializationController.getAllSpecializations.bind(specializationController));
router.post('/', specializationController.createSpecialization.bind(specializationController));
router.delete('/:codigo', specializationController.deleteSpecialization.bind(specializationController));

export default router;
