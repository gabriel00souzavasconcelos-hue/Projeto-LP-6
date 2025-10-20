import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController';

const router = Router();

// IMPORTANTE: Rotas específicas devem vir ANTES das rotas com parâmetros genéricos

// Buscar horários disponíveis
router.get('/slots/available', appointmentController.getAvailableSlots);

// Buscar consultas por paciente
router.get('/patient/:codigo_paciente', appointmentController.getAppointmentsByPatient);

// Buscar consultas por clínica
router.get('/clinic/:codigo_clinica', appointmentController.getAppointmentsByClinic);

// Criar nova consulta
router.post('/', appointmentController.createAppointment);

// Buscar consulta por ID
router.get('/:codigo', appointmentController.getAppointmentById);

// Atualizar status da consulta
router.patch('/:codigo/status', appointmentController.updateAppointmentStatus);

// Atualizar consulta
router.put('/:codigo', appointmentController.updateAppointment);

// Excluir consulta
router.delete('/:codigo', appointmentController.deleteAppointment);

export default router;
