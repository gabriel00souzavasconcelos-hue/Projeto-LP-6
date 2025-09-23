import { Request, Response } from 'express';
import { authService, LoginData, RegisterData } from '../services/authService';

export class AuthController {
  async login(req: Request, res: Response) {
    const loginData: LoginData = req.body;
    
    try {
      const user = await authService.login(loginData);
      res.json({ user });
    } catch (error: any) {
      const statusCode = error.message === 'Credenciais inválidas' ? 401 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async register(req: Request, res: Response) {
    const registerData: RegisterData = req.body;
    
    try {
      const user = await authService.register(registerData);
      res.status(201).json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const authController = new AuthController();