import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// IMPORTANTE: rotas específicas ANTES das com parâmetros genéricos

// Públicas — slots disponíveis podem ser consultados sem login
router.get('/slots/available', appointmentController.getAvailableSlots);

// Privadas — leitura por paciente/clínica exige token
router.get('/patient/:codigo_paciente', authenticate, appointmentController.getAppointmentsByPatient);
router.get('/clinic/:codigo_clinica',   authenticate, appointmentController.getAppointmentsByClinic);
router.get('/:codigo',                  authenticate, appointmentController.getAppointmentById);

// Privadas — escrita sempre exige token
router.post('/',              authenticate, appointmentController.createAppointment);
router.patch('/:codigo/status', authenticate, appointmentController.updateAppointmentStatus);
router.put('/:codigo',        authenticate, appointmentController.updateAppointment);
router.delete('/:codigo',     authenticate, appointmentController.deleteAppointment);

export default router;