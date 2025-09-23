import { Request, Response } from 'express';
import { clinicService, ClinicData, UpdateClinicData } from '../services/clinicService';

export class ClinicController {
  async getAllClinics(req: Request, res: Response) {
    try {
      const clinics = await clinicService.getAllClinics();
      res.json(clinics);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getClinicById(req: Request, res: Response) {
    try {
      const codigo = Number(req.params.codigo);
      const clinic = await clinicService.getClinicById(codigo);
      res.json(clinic);
    } catch (error: any) {
      const statusCode = error.message.includes('Código inválido') ? 400 : 404;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async createClinic(req: Request, res: Response) {
    try {
      const clinicData: ClinicData = req.body;
      const clinic = await clinicService.createClinic(clinicData);
      res.status(201).json(clinic);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateClinic(req: Request, res: Response) {
    try {
      const codigo = Number(req.params.codigo);
      const updateData: UpdateClinicData = req.body;
      const clinic = await clinicService.updateClinic(codigo, updateData);
      res.json(clinic);
    } catch (error: any) {
      const statusCode = error.message.includes('Código inválido') ? 400 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async deleteClinic(req: Request, res: Response) {
    try {
      const codigo = Number(req.params.codigo);
      const result = await clinicService.deleteClinic(codigo);
      res.json(result);
    } catch (error: any) {
      const statusCode = error.message.includes('Código inválido') ? 400 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
}

export const clinicController = new ClinicController();