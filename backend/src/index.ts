import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import patientsRouter from './routes/patients';
import clinicsRouter from './routes/clinics';
import specsRouter from './routes/specializations';
import authRouter from './routes/auth';
import appointmentsRouter from './routes/appointments';
import documentsRouter from './routes/documents';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

// Criar pasta uploads se não existir
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Pasta uploads criada');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Clinica API (TypeScript) - ok' });
});

// Upload endpoint
app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `http://192.168.100.198:${port}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/patients', patientsRouter);
app.use('/clinics', clinicsRouter);
app.use('/specializations', specsRouter);
app.use('/auth', authRouter);
app.use('/appointments', appointmentsRouter);
app.use('/documents', documentsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
