import { Router } from 'express';
import { authenticate, requireClinica } from '../middlewares/authMiddleware';
import { checkAddon } from '../middlewares/checkAddon';

const router = Router();

// Cadeia de middlewares: autenticado → é clínica → tem o add-on → controller
router.post(
  '/gerar-link',
  authenticate,
  requireClinica,
  checkAddon('telemedicina'),
  async (req, res) => {
    // Só chega aqui se passou por tudo acima
    res.json({ meetingUrl: 'https://meet.jit.si/consulta-abc123' });
  }
);

router.post(
  '/laudos/gerar-pdf',
  authenticate,
  requireClinica,
  checkAddon('pdf'),
  async (req, res) => {
    res.json({ pdfUrl: 'https://storage.supabase.co/laudos/abc.pdf' });
  }
);

export default router;