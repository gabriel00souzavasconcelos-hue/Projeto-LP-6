// backend/src/routes/patients.ts
import { Router, Request, Response } from "express";
import { supabase } from "../supabaseClient";
import { Patient } from "../types";

const router = Router();

/**
 * GET /patients
 * Lista todos os pacientes
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("pacientes").select("*");
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * GET /patients/:codigo
 */
router.get("/:codigo", async (req: Request, res: Response) => {
  const codigo = Number(req.params.codigo);
  if (Number.isNaN(codigo)) return res.status(400).json({ error: "Código inválido" });

  try {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (error) return res.status(404).json({ error: error.message });
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * POST /patients
 */
router.post("/", async (req: Request, res: Response) => {
  const { nome, datan, fone, ende, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Dados incompletos: nome, email e senha são obrigatórios" });
  }

  const payload = { nome, datan, fone, ende, email, senha };

  try {
    const { data, error } = await supabase
      .from("pacientes")
      .insert(payload)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * PUT /patients/:codigo
 */
router.put("/:codigo", async (req: Request, res: Response) => {
  const codigo = Number(req.params.codigo);
  if (Number.isNaN(codigo)) return res.status(400).json({ error: "Código inválido" });

  const { nome, datan, fone, ende, email, senha } = req.body;
  const update: any = {};
  
  if (nome !== undefined) update.nome = nome;
  if (datan !== undefined) update.datan = datan;
  if (fone !== undefined) update.fone = fone;
  if (ende !== undefined) update.ende = ende;
  if (email !== undefined) update.email = email;
  if (senha !== undefined) update.senha = senha;

  try {
    const { data, error } = await supabase
      .from("pacientes")
      .update(update)
      .eq("codigo", codigo)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * DELETE /patients/:codigo
 */
router.delete("/:codigo", async (req: Request, res: Response) => {
  const codigo = Number(req.params.codigo);
  if (Number.isNaN(codigo)) return res.status(400).json({ error: "Código inválido" });

  try {
    const { error } = await supabase.from("pacientes").delete().eq("codigo", codigo);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
