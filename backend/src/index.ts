import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { supabase } from './supabaseClient';
import patientsRouter from './routes/patients';
import clinicsRouter from './routes/clinics';
import specsRouter from './routes/specializations';
import authRouter from './routes/auth';
import appointmentsRouter from './routes/appointments';
import documentsRouter from './routes/documents';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

// Usar armazenamento em memória e enviar para Supabase Storage
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Nota: não servimos arquivos do sistema de arquivos local no Render (efêmero).
// Os arquivos serão enviados ao Supabase Storage e servidos por lá.

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Clinica API (TypeScript) - ok' });
});

// Upload endpoint
app.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File & { buffer?: Buffer };
    if (!file || !file.buffer) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = 'uploads'; // verifique se o bucket existe no Supabase
    const timestamp = Date.now();
    const filename = `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`;
    const filePath = filename;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage error', error);
      return res.status(500).json({ error: error.message || 'Storage upload failed' });
    }

    // obter URL pública (se o bucket for público) ou usar signed url
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl || null;

    return res.json({ imageUrl: publicUrl });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
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
