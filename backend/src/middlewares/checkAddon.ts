import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabaseClient'; // mesmo cliente do resto do projeto

// ============================================================
// TIPOS
// ============================================================

export type AddonKey =
  | 'addon_telemedicina'
  | 'addon_pdf'
  | 'addon_relatorios'
  | 'addon_api_externa';

export interface ClinicaAssinatura {
  codigo: number;
  codigo_clinica: number;
  plano: 'basico' | 'profissional' | 'enterprise';
  addon_telemedicina: boolean;
  addon_pdf: boolean;
  addon_relatorios: boolean;
  addon_api_externa: boolean;
  trial_ativo: boolean;
  trial_expira_em: string | null;
  ativo: boolean;
}

// Registro centralizado de add-ons
const ADDON_REGISTRY: Record<string, {
  key: AddonKey;
  label: string;
  descricao: string;
  plano_minimo: 'profissional' | 'enterprise';
  upgradeUrl: string;
}> = {
  telemedicina: {
    key: 'addon_telemedicina',
    label: 'Telemedicina',
    descricao: 'Geração de links de videoconsulta para pacientes',
    plano_minimo: 'profissional',
    upgradeUrl: 'https://app.suaclinica.com/planos?addon=telemedicina',
  },
  pdf: {
    key: 'addon_pdf',
    label: 'Geração de PDFs',
    descricao: 'Exportação de laudos, receitas e relatórios em PDF',
    plano_minimo: 'profissional',
    upgradeUrl: 'https://app.suaclinica.com/planos?addon=pdf',
  },
  relatorios: {
    key: 'addon_relatorios',
    label: 'Relatórios Avançados',
    descricao: 'Dashboards analíticos e exportação de dados',
    plano_minimo: 'enterprise',
    upgradeUrl: 'https://app.suaclinica.com/planos?addon=relatorios',
  },
  api_externa: {
    key: 'addon_api_externa',
    label: 'API Externa',
    descricao: 'Integração com sistemas HIS/PEP e webhooks',
    plano_minimo: 'enterprise',
    upgradeUrl: 'https://app.suaclinica.com/planos?addon=api',
  },
};

// ============================================================
// CACHE EM MEMÓRIA (evita query a cada request — TTL: 60s)
// ============================================================

interface CacheEntry {
  data: ClinicaAssinatura;
  expiresAt: number;
}

const subscriptionCache = new Map<number, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function getCached(clinicaId: number): ClinicaAssinatura | null {
  const entry = subscriptionCache.get(clinicaId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    subscriptionCache.delete(clinicaId);
    return null;
  }
  return entry.data;
}

function setCache(clinicaId: number, data: ClinicaAssinatura): void {
  subscriptionCache.set(clinicaId, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export function invalidateSubscriptionCache(clinicaId: number): void {
  subscriptionCache.delete(clinicaId);
}

// ============================================================
// BUSCA A ASSINATURA (com cache)
// ============================================================

async function getAssinatura(clinicaId: number): Promise<ClinicaAssinatura | null> {
  const cached = getCached(clinicaId);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('clinica_assinaturas')
    .select('*')
    .eq('codigo_clinica', clinicaId)
    .eq('ativo', true)
    .maybeSingle(); // maybeSingle não lança erro se não encontrar linha

  if (error || !data) return null;

  setCache(clinicaId, data as ClinicaAssinatura);
  return data as ClinicaAssinatura;
}

// ============================================================
// MIDDLEWARE PRINCIPAL: checkAddon
// ============================================================

/**
 * Verifica se a clínica autenticada possui o add-on ativo.
 *
 * Uso:
 *   router.post('/gerar-link',
 *     authenticate,
 *     requireClinica,
 *     checkAddon('telemedicina'),
 *     controller
 *   )
 */
export function checkAddon(addonName: string) {
  return async function addonGuard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const addonConfig = ADDON_REGISTRY[addonName];

    if (!addonConfig) {
      res.status(500).json({
        error: `Add-on '${addonName}' não está registrado no servidor.`,
        code: 'ADDON_NOT_REGISTERED',
      });
      return;
    }

    const clinicaId = req.user?.entityId;

    if (!clinicaId || req.user?.role !== 'clinica') {
      res.status(403).json({
        error: 'Apenas clínicas podem acessar esta funcionalidade.',
        code: 'FORBIDDEN_ROLE',
      });
      return;
    }

    try {
      const assinatura = await getAssinatura(clinicaId);

      if (!assinatura) {
        // Clínica sem assinatura cadastrada — trata como plano básico (sem add-ons)
        res.status(403).json({
          error: `O add-on "${addonConfig.label}" não está ativo no seu plano.`,
          code: 'ADDON_NOT_ACTIVE',
          addon: addonName,
          message: `Para usar ${addonConfig.label}, faça upgrade para o plano ${addonConfig.plano_minimo}.`,
          upgradeUrl: addonConfig.upgradeUrl,
        });
        return;
      }

      // Verifica trial expirado
      if (assinatura.trial_ativo && assinatura.trial_expira_em) {
        if (new Date(assinatura.trial_expira_em) < new Date()) {
          res.status(403).json({
            error: 'Seu período de trial expirou.',
            code: 'TRIAL_EXPIRED',
            upgradeUrl: addonConfig.upgradeUrl,
          });
          return;
        }
      }

      if (!assinatura[addonConfig.key]) {
        res.status(403).json({
          error: `O add-on "${addonConfig.label}" não está ativo no seu plano.`,
          code: 'ADDON_NOT_ACTIVE',
          addon: {
            key: addonName,
            label: addonConfig.label,
            descricao: addonConfig.descricao,
            plano_minimo: addonConfig.plano_minimo,
          },
          plano_atual: assinatura.plano,
          message: `Para usar ${addonConfig.label}, faça upgrade para o plano ${addonConfig.plano_minimo}.`,
          upgradeUrl: addonConfig.upgradeUrl,
        });
        return;
      }

      // Add-on ativo: injeta assinatura no req e segue para o controller
      (req as any).assinatura = assinatura;
      next();
    } catch (err) {
      console.error('[checkAddon] Erro ao verificar add-on:', err);
      res.status(500).json({ error: 'Erro interno ao verificar permissões.' });
    }
  };
}

// ============================================================
// SERVICE: Gerenciamento de add-ons (usado em rotas admin)
// ============================================================

export class AddonService {
  async getSubscription(clinicaId: number): Promise<ClinicaAssinatura | null> {
    return getAssinatura(clinicaId);
  }

  async setAddon(
    clinicaId: number,
    addonKey: AddonKey,
    value: boolean
  ): Promise<ClinicaAssinatura> {
    const { data, error } = await supabase
      .from('clinica_assinaturas')
      .update({ [addonKey]: value })
      .eq('codigo_clinica', clinicaId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    invalidateSubscriptionCache(clinicaId);
    return data as ClinicaAssinatura;
  }

  async upgradePlan(
    clinicaId: number,
    plano: 'basico' | 'profissional' | 'enterprise'
  ): Promise<ClinicaAssinatura> {
    const addonsPorPlano = {
      basico:        { addon_telemedicina: false, addon_pdf: false, addon_relatorios: false, addon_api_externa: false },
      profissional:  { addon_telemedicina: true,  addon_pdf: true,  addon_relatorios: false, addon_api_externa: false },
      enterprise:    { addon_telemedicina: true,  addon_pdf: true,  addon_relatorios: true,  addon_api_externa: true  },
    };

    const { data, error } = await supabase
      .from('clinica_assinaturas')
      .update({ plano, ...addonsPorPlano[plano] })
      .eq('codigo_clinica', clinicaId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    invalidateSubscriptionCache(clinicaId);
    return data as ClinicaAssinatura;
  }

  async startTrial(clinicaId: number): Promise<ClinicaAssinatura> {
    const trialExpira = new Date();
    trialExpira.setDate(trialExpira.getDate() + 14);

    const { data, error } = await supabase
      .from('clinica_assinaturas')
      .update({
        trial_ativo: true,
        trial_expira_em: trialExpira.toISOString(),
        addon_telemedicina: true,
        addon_pdf: true,
      })
      .eq('codigo_clinica', clinicaId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    invalidateSubscriptionCache(clinicaId);
    return data as ClinicaAssinatura;
  }
}

export const addonService = new AddonService();