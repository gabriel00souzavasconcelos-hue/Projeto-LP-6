import { Router } from 'express';
import * as documentController from '../controllers/documentController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// IMPORTANTE: rotas específicas ANTES das com parâmetros genéricos

// Todas as rotas de documentos exigem token —
// documentos médicos são sempre dados sensíveis
router.get('/patient/:codigo_paciente',                          authenticate, documentController.getDocumentsByPatient);
router.get('/clinic/:codigo_clinica',                            authenticate, documentController.getDocumentsByClinic);
router.get('/patient/:codigo_paciente/clinic/:codigo_clinica',   authenticate, documentController.getDocumentsByPatientAndClinic);
router.get('/:codigo',                                           authenticate, documentController.getDocumentById);

router.post('/',          authenticate, documentController.createDocument);
router.put('/:codigo',    authenticate, documentController.updateDocument);
router.delete('/:codigo', authenticate, documentController.deleteDocument);

export default router;