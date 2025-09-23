import { Request, Response } from 'express';
import { specializationService, SpecializationData } from '../services/specializationService';

export class SpecializationController {
  async getAllSpecializations(req: Request, res: Response) {
    try {
      const specializations = await specializationService.getAllSpecializations();
      res.json(specializations);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createSpecialization(req: Request, res: Response) {
    try {
      const specializationData: SpecializationData = req.body;
      const specialization = await specializationService.createSpecialization(specializationData);
      res.status(201).json(specialization);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSpecialization(req: Request, res: Response) {
    try {
      const codigo = Number(req.params.codigo);
      const result = await specializationService.deleteSpecialization(codigo);
      res.json(result);
    } catch (error: any) {
      const statusCode = error.message.includes('Código inválido') ? 400 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }
}

export const specializationController = new SpecializationController();