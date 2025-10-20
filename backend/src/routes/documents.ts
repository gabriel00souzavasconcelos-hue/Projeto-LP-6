import { Router } from 'express';
import * as documentController from '../controllers/documentController';

const router = Router();

// IMPORTANTE: Rotas específicas devem vir ANTES das rotas com parâmetros genéricos

// Buscar documentos por paciente
router.get('/patient/:codigo_paciente', documentController.getDocumentsByPatient);

// Buscar documentos por clínica
router.get('/clinic/:codigo_clinica', documentController.getDocumentsByClinic);

// Buscar documentos por paciente e clínica específica
router.get('/patient/:codigo_paciente/clinic/:codigo_clinica', documentController.getDocumentsByPatientAndClinic);

// Criar novo documento
router.post('/', documentController.createDocument);

// Buscar documento por ID
router.get('/:codigo', documentController.getDocumentById);

// Atualizar documento
router.put('/:codigo', documentController.updateDocument);

// Excluir documento
router.delete('/:codigo', documentController.deleteDocument);

export default router;
