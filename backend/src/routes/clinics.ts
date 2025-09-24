import { Router } from 'express';
import { clinicController } from '../controllers/clinicController';

const router = Router();

router.get('/', clinicController.getAllClinics.bind(clinicController));
router.get('/:codigo', clinicController.getClinicById.bind(clinicController));
router.post('/', clinicController.createClinic.bind(clinicController));
router.put('/:codigo', clinicController.updateClinic.bind(clinicController));
router.delete('/:codigo', clinicController.deleteClinic.bind(clinicController));

// Rotas para gerenciamento de especializações da clínica
router.get('/:codigo/specializations', clinicController.getClinicSpecializations.bind(clinicController));
router.post('/:codigo/specializations', clinicController.addSpecializationToClinic.bind(clinicController));
router.delete('/:codigo/specializations/:especializacao', clinicController.removeSpecializationFromClinic.bind(clinicController));

export default router;
