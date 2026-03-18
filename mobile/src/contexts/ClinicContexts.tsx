import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/client';

// ============================================================
// TIPOS
// ============================================================

export type Plano = 'basico' | 'profissional' | 'enterprise';

export interface ClinicAddons {
  addon_telemedicina: boolean;
  addon_pdf: boolean;
  addon_relatorios: boolean;
  addon_api_externa: boolean;
}

export interface ClinicSubscription {
  plano: Plano;
  addons: ClinicAddons;
  trial_ativo: boolean;
  trial_expira_em: string | null;
  trial_expired?: boolean;
}

interface ClinicContextData {
  clinic: any | null;
  token: string | null;
  subscription: ClinicSubscription | null;
  loading: boolean;

  // Verifica add-on sem request — lê do estado local
  hasAddon: (addon: keyof ClinicAddons) => boolean;

  // Chamado no login
  loadClinicSession: (clinicData: any, accessToken: string) => Promise<void>;

  // Recarrega do servidor (ex: após upgrade de plano)
  refreshSubscription: () => Promise<void>;

  // Ativa trial de 14 dias
  startTrial: () => Promise<{ success: boolean; message: string }>;

  clearSession: () => void;
}

// ============================================================
// DEFAULTS
// ============================================================

const SUBSCRIPTION_STORAGE_KEY = '@clinica:subscription';
const TOKEN_STORAGE_KEY = '@clinica:token';

const DEFAULT_SUBSCRIPTION: ClinicSubscription = {
  plano: 'basico',
  addons: {
    addon_telemedicina: false,
    addon_pdf: false,
    addon_relatorios: false,
    addon_api_externa: false,
  },
  trial_ativo: false,
  trial_expira_em: null,
};

// ============================================================
// CONTEXT
// ============================================================

const ClinicContext = createContext<ClinicContextData>({} as ClinicContextData);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [clinic, setClinic] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<ClinicSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  // Guarda token em ref para usar nos fetches sem depender do estado
  const tokenRef = useRef<string | null>(null);

  // ============================================================
  // FETCH DA ASSINATURA (único ponto de busca)
  // ============================================================
  const fetchSubscription = useCallback(async (
    clinicaId: number,
    accessToken: string
  ): Promise<ClinicSubscription> => {
    try {
      const response = await fetch(`${BASE_URL}/addons/subscription`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error('Falha ao buscar assinatura');

      const data = await response.json();

      const parsed: ClinicSubscription = {
        plano: data.plano ?? 'basico',
        addons: {
          addon_telemedicina: data.addon_telemedicina ?? false,
          addon_pdf: data.addon_pdf ?? false,
          addon_relatorios: data.addon_relatorios ?? false,
          addon_api_externa: data.addon_api_externa ?? false,
        },
        trial_ativo: data.trial_ativo ?? false,
        trial_expira_em: data.trial_expira_em ?? null,
        trial_expired: data.trial_expired ?? false,
      };

      // Persiste localmente para restaurar offline
      await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(parsed));

      return parsed;
    } catch {
      // Fallback: tenta restaurar do AsyncStorage se offline
      const cached = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (cached) return JSON.parse(cached) as ClinicSubscription;
      return DEFAULT_SUBSCRIPTION;
    }
  }, []);

  // ============================================================
  // loadClinicSession — chamado no login
  // ============================================================
  const loadClinicSession = useCallback(async (
    clinicData: any,
    accessToken: string
  ) => {
    setLoading(true);
    setClinic(clinicData);
    setToken(accessToken);
    tokenRef.current = accessToken;

    // Persiste token para restaurar sessão após fechar o app
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, accessToken);

    const sub = await fetchSubscription(clinicData.codigo, accessToken);
    setSubscription(sub);
    setLoading(false);
  }, [fetchSubscription]);

  // ============================================================
  // refreshSubscription — após upgrade ou mudança de add-on
  // ============================================================
  const refreshSubscription = useCallback(async () => {
    if (!clinic?.codigo || !tokenRef.current) return;
    setLoading(true);
    const sub = await fetchSubscription(clinic.codigo, tokenRef.current);
    setSubscription(sub);
    setLoading(false);
  }, [clinic, fetchSubscription]);

  // ============================================================
  // startTrial — auto-serviço de trial
  // ============================================================
  const startTrial = useCallback(async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    if (!tokenRef.current) return { success: false, message: 'Não autenticado.' };

    try {
      const response = await fetch(`${BASE_URL}/addons/trial`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Atualiza contexto local imediatamente sem esperar refresh
        setSubscription(prev => prev ? {
          ...prev,
          trial_ativo: true,
          addons: {
            ...prev.addons,
            addon_telemedicina: true,
            addon_pdf: true,
          },
        } : prev);

        return { success: true, message: data.message };
      }

      return { success: false, message: data.error ?? 'Erro ao ativar trial.' };
    } catch {
      return { success: false, message: 'Erro de conexão.' };
    }
  }, []);

  // ============================================================
  // hasAddon — sem request, lê do estado
  // ============================================================
  const hasAddon = useCallback((addon: keyof ClinicAddons): boolean => {
    return subscription?.addons[addon] ?? false;
  }, [subscription]);

  // ============================================================
  // clearSession — logout
  // ============================================================
  const clearSession = useCallback(async () => {
    setClinic(null);
    setToken(null);
    setSubscription(null);
    tokenRef.current = null;
    await AsyncStorage.multiRemove([SUBSCRIPTION_STORAGE_KEY, TOKEN_STORAGE_KEY]);
  }, []);

  return (
    <ClinicContext.Provider value={{
      clinic,
      token,
      subscription,
      loading,
      hasAddon,
      loadClinicSession,
      refreshSubscription,
      startTrial,
      clearSession,
    }}>
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic deve ser usado dentro de <ClinicProvider>');
  }
  return context;
}