import { Router, Request, Response } from 'express';
import { authenticate, requireClinica } from '../middlewares/authMiddleware';
import { checkAddon, addonService, invalidateSubscriptionCache } from '../middlewares/checkAddon';
import { supabase } from '../supabaseClient';

const router = Router();

// ============================================================
// GET /addons/subscription
// Retorna a assinatura e add-ons da clínica autenticada
// Usado pelo frontend logo após login para cachear no contexto
// ============================================================
router.get(
  '/subscription',
  authenticate,
  requireClinica,
  async (req: Request, res: Response) => {
    try {
      const clinicaId = req.user!.entityId;
      const assinatura = await addonService.getSubscription(clinicaId);

      if (!assinatura) {
        return res.status(404).json({
          error: 'Assinatura não encontrada.',
          code: 'SUBSCRIPTION_NOT_FOUND',
        });
      }

      // Verifica trial expirado e desativa automaticamente
      if (assinatura.trial_ativo && assinatura.trial_expira_em) {
        const trialExpired = new Date(assinatura.trial_expira_em) < new Date();
        if (trialExpired) {
          await supabase
            .from('clinica_assinaturas')
            .update({
              trial_ativo: false,
              addon_telemedicina: false,
              addon_pdf: false,
            })
            .eq('codigo_clinica', clinicaId);

          invalidateSubscriptionCache(clinicaId);

          return res.json({
            ...assinatura,
            trial_ativo: false,
            addon_telemedicina: false,
            addon_pdf: false,
            trial_expired: true,
          });
        }
      }

      res.json(assinatura);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ============================================================
// POST /addons/trial
// Inicia trial de 14 dias (self-service)
// ============================================================
router.post(
  '/trial',
  authenticate,
  requireClinica,
  async (req: Request, res: Response) => {
    try {
      const clinicaId = req.user!.entityId;
      const assinatura = await addonService.getSubscription(clinicaId);

      // Não permite trial duplo
      if (assinatura?.trial_ativo) {
        return res.status(409).json({
          error: 'Sua clínica já utilizou o período de trial.',
          code: 'TRIAL_ALREADY_USED',
        });
      }

      const updated = await addonService.startTrial(clinicaId);
      res.status(201).json({
        message: 'Trial de 14 dias ativado com sucesso!',
        assinatura: updated,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ============================================================
// ROTAS DE EXEMPLO — Funcionalidades premium protegidas
// ============================================================

// POST /addons/telemedicina/gerar-link
router.post(
  '/telemedicina/gerar-link',
  authenticate,
  requireClinica,
  checkAddon('telemedicina'),
  async (req: Request, res: Response) => {
    const { codigo_consulta } = req.body;

    if (!codigo_consulta) {
      return res.status(400).json({ error: 'codigo_consulta é obrigatório.' });
    }

    // Aqui você integraria com Jitsi, Daily.co, Twilio Video, etc.
    const roomId = `consulta-${codigo_consulta}-${Date.now()}`;
    const meetingUrl = `https://meet.jit.si/${roomId}`;

    res.json({
      meetingUrl,
      roomId,
      expiresIn: 3600, // 1 hora
      instrucoes: 'Compartilhe este link com o paciente antes da consulta.',
    });
  }
);

// POST /addons/pdf/gerar-laudo
router.post(
  '/pdf/gerar-laudo',
  authenticate,
  requireClinica,
  checkAddon('pdf'),
  async (req: Request, res: Response) => {
    const { codigo_consulta, conteudo } = req.body;

    if (!codigo_consulta || !conteudo) {
      return res.status(400).json({ error: 'codigo_consulta e conteudo são obrigatórios.' });
    }

    // Aqui você integraria com puppeteer, pdfkit, etc.
    // Exemplo de resposta simulada:
    res.json({
      pdfUrl: `https://storage.supabase.co/v1/object/public/uploads/laudos/laudo-${codigo_consulta}.pdf`,
      geradoEm: new Date().toISOString(),
      message: 'PDF gerado com sucesso.',
    });
  }
);

// ============================================================
// ROTA ADMIN — Gerenciar add-ons de clínicas
// Proteger com autenticação de administrador no seu sistema
// ============================================================

// PUT /addons/admin/:clinicaId/addon
// Body: { addon: 'addon_telemedicina', value: true }
router.put(
  '/admin/:clinicaId/addon',
  authenticate,
  async (req: Request, res: Response) => {
    // Em produção: verificar se req.user é admin do sistema
    const { clinicaId } = req.params;
    const { addon, value } = req.body;

    if (typeof value !== 'boolean' || !addon) {
      return res.status(400).json({ error: 'addon e value (boolean) são obrigatórios.' });
    }

    try {
      const updated = await addonService.setAddon(Number(clinicaId), addon, value);
      res.json({ message: `Add-on '${addon}' atualizado.`, assinatura: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /addons/admin/:clinicaId/plano
// Body: { plano: 'profissional' }
router.put(
  '/admin/:clinicaId/plano',
  authenticate,
  async (req: Request, res: Response) => {
    const { clinicaId } = req.params;
    const { plano } = req.body;

    if (!['basico', 'profissional', 'enterprise'].includes(plano)) {
      return res.status(400).json({ error: 'Plano inválido.' });
    }

    try {
      const updated = await addonService.upgradePlan(Number(clinicaId), plano);
      res.json({ message: `Plano atualizado para '${plano}'.`, assinatura: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;