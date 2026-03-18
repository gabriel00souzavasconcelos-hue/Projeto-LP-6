import { Router } from 'express';
import { clinicController } from '../controllers/clinicController';
import { authenticate, requireClinica } from '../middlewares/authMiddleware';

const router = Router();

// Públicas — qualquer um pode listar e ver detalhes de clínicas
router.get('/',         clinicController.getAllClinics.bind(clinicController));
router.get('/:codigo',  clinicController.getClinicById.bind(clinicController));
router.post('/',        clinicController.createClinic.bind(clinicController)); // cadastro público

// Privadas — apenas a clínica dona pode editar/deletar
router.put('/:codigo',    authenticate, requireClinica, clinicController.updateClinic.bind(clinicController));
router.delete('/:codigo', authenticate, requireClinica, clinicController.deleteClinic.bind(clinicController));

// Especializações — leitura pública, escrita privada
router.get('/:codigo/specializations',                       clinicController.getClinicSpecializations.bind(clinicController));
router.post('/:codigo/specializations',   authenticate, requireClinica, clinicController.addSpecializationToClinic.bind(clinicController));
router.delete('/:codigo/specializations/:especializacao', authenticate, requireClinica, clinicController.removeSpecializationFromClinic.bind(clinicController));

export default router;