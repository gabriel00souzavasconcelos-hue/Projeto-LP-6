// backend/src/index.ts
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente PRIMEIRO
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import patientsRouter from './routes/patients';
import clinicsRouter from './routes/clinics';
import specsRouter from './routes/specializations';
import authRouter from './routes/auth';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Clinica API (TypeScript) - ok' });
});

// Rotas
app.use('/patients', patientsRouter);
app.use('/clinics', clinicsRouter);
app.use('/specializations', specsRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
