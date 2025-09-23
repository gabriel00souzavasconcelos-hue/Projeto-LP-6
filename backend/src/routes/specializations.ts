// backend/src/routes/specializations.ts
import { Router } from 'express';
import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

/**
 * GET /specializations
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('especializacoes').select('*');
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * POST /specializations
 * Body: { nome }
 */
router.post('/', async (req: Request, res: Response) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome obrigatório' });

  const payload = { nome };

  try {
    const { data, error } = await supabase.from('especializacoes').insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * DELETE /specializations/:codigo
 */
router.delete('/:codigo', async (req: Request, res: Response) => {
  const codigo = Number(req.params.codigo);
  if (Number.isNaN(codigo)) return res.status(400).json({ error: 'Código inválido' });

  try {
    const { error } = await supabase.from('especializacoes').delete().eq('codigo', codigo);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
