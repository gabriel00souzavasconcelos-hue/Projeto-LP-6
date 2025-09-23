// backend/src/routes/auth.ts
import { Router } from 'express';
import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

/**
 * POST /auth/login
 * Body: { email, senha, role }  where role is 'paciente' | 'clinica'
 *
 * NOTE: This simple auth checks email+senha in the respective table.
 * For production you should use hashed passwords and proper auth (JWT/OAuth) or Supabase Auth.
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, senha, role } = req.body;

  if (!email || !senha || (role !== 'paciente' && role !== 'clinica')) {
    return res.status(400).json({ error: 'Dados de login inválidos' });
  }

  try {
    const table = role === 'paciente' ? 'pacientes' : 'clinicas';
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .limit(1)
      .single();

    if (error) return res.status(401).json({ error: 'Credenciais inválidas' });

    // Remove senha before retornar (para não expor)
    const safe = { ...data };
    delete (safe as any).senha;

    return res.json({ user: safe });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

/**
 * POST /auth/register
 * Body: { role, payload }
 * role: 'paciente' | 'clinica'
 *
 * This creates the row in the corresponding table. For production, use hashed passwords.
 */
router.post('/register', async (req: Request, res: Response) => {
  const { role, payload } = req.body;

  if (!role || !payload) return res.status(400).json({ error: 'Dados inválidos' });

  try {
    const table = role === 'paciente' ? 'pacientes' : 'clinicas';
    const { data, error } = await supabase.from(table).insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });

    const safe = { ...data };
    delete (safe as any).senha;
    return res.status(201).json({ user: safe });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
