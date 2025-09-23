// backend/src/routes/clinics.ts
import { Router } from 'express';
import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

/**
 * GET /clinics
 * Lista todas as clinicas
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('clinicas').select('*');
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * GET /clinics/:codigo
 */
router.get('/:codigo', async (req: Request, res: Response) => {
  const codigo = Number(req.params.codigo);
  if (Number.isNaN(codigo)) return res.status(400).json({ error: 'Código inválido' });

  try {
    const { data, error } = await supabase.from('clinicas').select('*').eq('codigo', codigo).limit(1).single();
    if (error) return res.status(404).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * POST /clinics
 * Cria clinica
 * Body: { nome, endereco, fone, email, senha, imagem? }
 */
router.post('/', async (req: Request, res: Response) => {
  const { nome, endereco, fone, email, senha, imagem } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Dados incompletos: nome, email e senha são obrigatórios' });
  }

  const payload = { nome, endereco, fone, email, senha, imagem };

  try {
    const { data, error } = await supabase.from('clinicas').insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * PUT /clinics/:codigo
 */
router.put('/:codigo', async (req: Request, res: Response) => {
  const codigo = Number(req.params.codigo);
  if (Number.isNaN(codigo)) return res.status(400).json({ error: 'Código inválido' });

  const { nome, endereco, fone, email, senha, imagem } = req.body;
  const update: any = {};
  
  if (nome !== undefined) update.nome = nome;
  if (endereco !== undefined) update.endereco = endereco;
  if (fone !== undefined) update.fone = fone;
  if (email !== undefined) update.email = email;
  if (senha !== undefined) update.senha = senha;
  if (imagem !== undefined) update.imagem = imagem;

  try {
    const { data, error } = await supabase.from('clinicas').update(update).eq('codigo', codigo).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * DELETE /clinics/:codigo
 */
router.delete('/:codigo', async (req: Request, res: Response) => {
  const codigo = Number(req.params.codigo);
  if (Number.isNaN(codigo)) return res.status(400).json({ error: 'Código inválido' });

  try {
    const { error } = await supabase.from('clinicas').delete().eq('codigo', codigo);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
