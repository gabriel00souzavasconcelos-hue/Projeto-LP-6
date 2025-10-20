import { Request, Response } from 'express';
import * as appointmentService from '../services/appointmentService';

export async function createAppointment(req: Request, res: Response) {
  try {
    const appointmentData = req.body;
    const newAppointment = await appointmentService.createAppointment(appointmentData);
    res.status(201).json(newAppointment);
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getAppointmentById(req: Request, res: Response) {
  try {
    const { codigo } = req.params;
    const appointment = await appointmentService.getAppointmentById(Number(codigo));
    
    if (!appointment) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }
    
    res.json(appointment);
  } catch (error: any) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getAppointmentsByPatient(req: Request, res: Response) {
  try {
    const { codigo_paciente } = req.params;
    const appointments = await appointmentService.getAppointmentsByPatient(Number(codigo_paciente));
    res.json(appointments);
  } catch (error: any) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getAppointmentsByClinic(req: Request, res: Response) {
  try {
    const { codigo_clinica } = req.params;
    const appointments = await appointmentService.getAppointmentsByClinic(Number(codigo_clinica));
    res.json(appointments);
  } catch (error: any) {
    console.error('Error fetching clinic appointments:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  try {
    const { codigo } = req.params;
    const { status } = req.body;
    
    if (!status || !['agendada', 'confirmada', 'cancelada', 'concluida'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    
    const updatedAppointment = await appointmentService.updateAppointmentStatus(Number(codigo), status);
    res.json(updatedAppointment);
  } catch (error: any) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateAppointment(req: Request, res: Response) {
  try {
    const { codigo } = req.params;
    const updates = req.body;
    const updatedAppointment = await appointmentService.updateAppointment(Number(codigo), updates);
    res.json(updatedAppointment);
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteAppointment(req: Request, res: Response) {
  try {
    const { codigo } = req.params;
    const result = await appointmentService.deleteAppointment(Number(codigo));
    res.json(result);
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getAvailableSlots(req: Request, res: Response) {
  try {
    const { codigo_clinica, data } = req.query;
    
    if (!codigo_clinica || !data) {
      return res.status(400).json({ error: 'codigo_clinica e data são obrigatórios' });
    }
    
    const slots = await appointmentService.getAvailableSlots(Number(codigo_clinica), data as string);
    res.json(slots);
  } catch (error: any) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: error.message });
  }
}
