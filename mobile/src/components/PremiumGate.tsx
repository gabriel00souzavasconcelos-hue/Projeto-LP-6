import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAddonGuard, ADDON_CONFIG } from '../hooks/useAddonGuard';
import { useClinic, ClinicAddons, Plano } from '../contexts/ClinicContexts';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../styles/theme';

// ============================================================
// PlanBadge — mostra o plano mínimo exigido
// ============================================================

interface PlanBadgeProps {
  plano: Plano;
  style?: ViewStyle;
}

const PLANO_LABEL: Record<Plano, string> = {
  basico: 'Básico',
  profissional: 'Pro',
  enterprise: 'Enterprise',
};

const PLANO_COLOR: Record<Plano, string> = {
  basico: '#8E8E93',
  profissional: '#007AFF',
  enterprise: '#FF9500',
};

export function PlanBadge({ plano, style }: PlanBadgeProps) {
  const color = PLANO_COLOR[plano];
  return (
    <View style={[{ backgroundColor: color + '20', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }, style]}>
      <Text style={{ fontSize: 10, fontWeight: '600', color, letterSpacing: 0.3 }}>
        {PLANO_LABEL[plano].toUpperCase()}
      </Text>
    </View>
  );
}

// ============================================================
// PremiumGate — wrapper que bloqueia visualmente se não tiver add-on
// ============================================================

interface PremiumGateProps {
  addon: keyof ClinicAddons;
  children: React.ReactNode;

  // Se true, oculta completamente o conteúdo em vez de mostrar bloqueado
  hideIfLocked?: boolean;

  // Estilo do container externo
  style?: ViewStyle;
}

export function PremiumGate({
  addon,
  children,
  hideIfLocked = false,
  style,
}: PremiumGateProps) {
  const { isUnlocked, config, showUpsell } = useAddonGuard(addon);

  if (isUnlocked) {
    return <View style={style}>{children}</View>;
  }

  if (hideIfLocked) return null;

  return (
    <TouchableOpacity
      style={[styles.lockedContainer, style]}
      onPress={showUpsell}
      activeOpacity={0.8}
    >
      {/* Conteúdo original desfocado atrás */}
      <View style={styles.blurredContent} pointerEvents="none">
        {children}
      </View>

      {/* Overlay de bloqueio */}
      <View style={styles.lockOverlay}>
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={18} color={colors.surface} />
          <Text style={styles.lockText}>{config.label}</Text>
          <PlanBadge plano={config.plano_minimo} style={{ marginLeft: 6 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ============================================================
// PremiumActionCard — card de menu com suporte a cadeado
// Substitui as ModernCard nas telas de menu para add-ons premium
// ============================================================

interface PremiumActionCardProps {
  addon: keyof ClinicAddons;
  onPress: () => void;
  style?: ViewStyle;
}

export function PremiumActionCard({
  addon,
  onPress,
  style,
}: PremiumActionCardProps) {
  const { isUnlocked, config, guard } = useAddonGuard(addon);

  return (
    <TouchableOpacity
      style={[styles.actionCard, !isUnlocked && styles.actionCardLocked, style]}
      onPress={() => guard(onPress)}
      activeOpacity={0.75}
    >
      {/* Ícone principal */}
      <View style={[
        styles.iconContainer,
        { backgroundColor: isUnlocked ? config.cor + '18' : colors.surfaceVariant },
      ]}>
        <Ionicons
          name={config.icone as any}
          size={26}
          color={isUnlocked ? config.cor : colors.textMuted}
        />
      </View>

      {/* Textos */}
      <View style={styles.actionTexts}>
        <Text style={[styles.actionTitle, !isUnlocked && styles.lockedText]}>
          {config.label}
        </Text>
        <Text style={styles.actionDesc} numberOfLines={2}>
          {config.descricao}
        </Text>
      </View>

      {/* Ícone de estado: seta ou cadeado */}
      <View style={styles.stateIcon}>
        {isUnlocked ? (
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        ) : (
          <View style={styles.lockPill}>
            <Ionicons name="lock-closed" size={12} color={colors.surface} />
            <Text style={styles.lockPillText}>
              {config.plano_minimo === 'enterprise' ? 'Enterprise' : 'Pro'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ============================================================
// SubscriptionBanner — banner no topo do ClinicMenu
// Exibe plano atual e CTA de upgrade
// ============================================================

interface SubscriptionBannerProps {
  onUpgradePress: () => void;
}

export function SubscriptionBanner({ onUpgradePress }: SubscriptionBannerProps) {
  const { subscription } = useClinic();

  if (!subscription) return null;

  const plano = subscription.plano as Plano;
  const isBasico = plano === 'basico';
  const trialAtivo = subscription.trial_ativo;

  if (!isBasico && !trialAtivo) return null; // Plano pago: não exibe banner

  const trialExpiraEm = subscription.trial_expira_em
    ? new Date(subscription.trial_expira_em).toLocaleDateString('pt-BR')
    : null;

  return (
    <TouchableOpacity style={styles.banner} onPress={onUpgradePress} activeOpacity={0.85}>
      <View style={styles.bannerLeft}>
        <Ionicons name="star-outline" size={18} color="#FF9500" />
        <View style={styles.bannerTexts}>
          {trialAtivo ? (
            <>
              <Text style={styles.bannerTitle}>Trial ativo até {trialExpiraEm}</Text>
              <Text style={styles.bannerSub}>Faça upgrade para manter o acesso</Text>
            </>
          ) : (
            <>
              <Text style={styles.bannerTitle}>Você está no plano Básico</Text>
              <Text style={styles.bannerSub}>Experimente o Pro por 14 dias grátis</Text>
            </>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#FF9500" />
    </TouchableOpacity>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  lockedContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
  },
  blurredContent: {
    opacity: 0.35,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: borderRadius.lg,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  lockText: {
    color: colors.surface,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionCardLocked: {
    borderStyle: 'dashed',
    borderColor: colors.border,
    opacity: 0.85,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionTexts: {
    flex: 1,
    marginRight: spacing.sm,
  },
  actionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  lockedText: {
    color: colors.textSecondary,
  },
  actionDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  stateIcon: {
    alignItems: 'flex-end',
  },
  lockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
    gap: 4,
  },
  lockPillText: {
    fontSize: 10,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF950015',
    borderWidth: 1,
    borderColor: '#FF950040',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  bannerTexts: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: '#FF9500',
  },
  bannerSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
});