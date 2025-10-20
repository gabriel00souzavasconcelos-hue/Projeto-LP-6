import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";
import ModernCard from "../components/ModernCard";
import { getAppointmentsByClinic } from "../api/client";
import { AppointmentWithDetails } from "../types";

const { width } = Dimensions.get('window');

type Props = {
  navigation: any;
  route: any;
};

type Stats = {
  total: number;
  agendadas: number;
  confirmadas: number;
  concluidas: number;
  canceladas: number;
  thisMonth: number;
  lastMonth: number;
  bySpecialization: Record<string, number>;
};

export default function ClinicReportsScreen({ route }: Props) {
  const clinic = route.params?.clinic;
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    agendadas: 0,
    confirmadas: 0,
    concluidas: 0,
    canceladas: 0,
    thisMonth: 0,
    lastMonth: 0,
    bySpecialization: {},
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (clinic?.codigo) {
      loadAppointments();
    }
  }, [clinic?.codigo]);

  useEffect(() => {
    if (appointments.length > 0) {
      calculateStats();
    }
  }, [appointments]);

  const loadAppointments = async () => {
    try {
      const data = await getAppointmentsByClinic(clinic.codigo);
      setAppointments(data);
    } catch (error: any) {
      console.error("Erro ao carregar relatórios:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const bySpecialization: Record<string, number> = {};

    const calculatedStats = appointments.reduce(
      (acc, apt) => {
        const aptDate = new Date(apt.data_hora);
        const aptMonth = aptDate.getMonth();
        const aptYear = aptDate.getFullYear();

        // Total
        acc.total++;

        // Por status
        switch (apt.status) {
          case 'agendada':
            acc.agendadas++;
            break;
          case 'confirmada':
            acc.confirmadas++;
            break;
          case 'concluida':
            acc.concluidas++;
            break;
          case 'cancelada':
            acc.canceladas++;
            break;
        }

        // Este mês
        if (aptMonth === currentMonth && aptYear === currentYear) {
          acc.thisMonth++;
        }

        // Mês passado
        if (aptMonth === lastMonth && aptYear === lastMonthYear) {
          acc.lastMonth++;
        }

        // Por especialização
        const specName = apt.especializacoes?.nome || apt.especializacao_nome || 'Outros';
        bySpecialization[specName] = (bySpecialization[specName] || 0) + 1;

        return acc;
      },
      {
        total: 0,
        agendadas: 0,
        confirmadas: 0,
        concluidas: 0,
        canceladas: 0,
        thisMonth: 0,
        lastMonth: 0,
        bySpecialization: {},
      }
    );

    setStats({ ...calculatedStats, bySpecialization });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const StatCard = ({ icon, label, value, color, subtitle }: any) => (
    <ModernCard variant="elevated" style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </ModernCard>
  );

  const ProgressBar = ({ label, value, total, color }: any) => {
    const percentage = getPercentage(value, total);
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>
            {value} ({percentage}%)
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    );
  };

  const monthDiff = stats.thisMonth - stats.lastMonth;
  const monthDiffPercentage = stats.lastMonth > 0
    ? Math.round((monthDiff / stats.lastMonth) * 100)
    : 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Estatísticas da Clínica</Text>

      {/* Cards de Resumo */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="calendar"
          label="Total de Consultas"
          value={stats.total}
          color={colors.primary}
        />
        <StatCard
          icon="trending-up"
          label="Este Mês"
          value={stats.thisMonth}
          color={colors.success}
          subtitle={monthDiff > 0 ? `+${monthDiffPercentage}% vs mês anterior` : monthDiff < 0 ? `${monthDiffPercentage}% vs mês anterior` : 'Igual ao mês anterior'}
        />
      </View>

      {/* Status das Consultas */}
      <ModernCard variant="elevated" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Status das Consultas</Text>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.warning }]} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusValue}>{stats.agendadas}</Text>
              <Text style={styles.statusLabel}>Agendadas</Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusValue}>{stats.confirmadas}</Text>
              <Text style={styles.statusLabel}>Confirmadas</Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusValue}>{stats.concluidas}</Text>
              <Text style={styles.statusLabel}>Concluídas</Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.error }]} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusValue}>{stats.canceladas}</Text>
              <Text style={styles.statusLabel}>Canceladas</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <ProgressBar
            label="Agendadas"
            value={stats.agendadas}
            total={stats.total}
            color={colors.warning}
          />
          <ProgressBar
            label="Confirmadas"
            value={stats.confirmadas}
            total={stats.total}
            color={colors.success}
          />
          <ProgressBar
            label="Concluídas"
            value={stats.concluidas}
            total={stats.total}
            color={colors.primary}
          />
          <ProgressBar
            label="Canceladas"
            value={stats.canceladas}
            total={stats.total}
            color={colors.error}
          />
        </View>
      </ModernCard>

      {/* Por Especialização */}
      {Object.keys(stats.bySpecialization).length > 0 && (
        <ModernCard variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Consultas por Especialização</Text>
          {Object.entries(stats.bySpecialization)
            .sort(([, a], [, b]) => b - a)
            .map(([spec, count], index) => (
              <View key={spec} style={styles.specializationItem}>
                <View style={styles.specializationInfo}>
                  <View style={[styles.specializationNumber, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.specializationNumberText, { color: colors.primary }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={styles.specializationName}>{spec}</Text>
                </View>
                <Text style={styles.specializationCount}>{count}</Text>
              </View>
            ))}
        </ModernCard>
      )}

      {/* Taxa de Conclusão */}
      <ModernCard variant="elevated" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.performanceContainer}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Taxa de Conclusão</Text>
            <Text style={[styles.performanceValue, { color: colors.success }]}>
              {getPercentage(stats.concluidas, stats.total)}%
            </Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Taxa de Cancelamento</Text>
            <Text style={[styles.performanceValue, { color: colors.error }]}>
              {getPercentage(stats.canceladas, stats.total)}%
            </Text>
          </View>
        </View>
      </ModernCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  statSubtitle: {
    fontSize: fontSize.xs,
    color: colors.success,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: (width - spacing.lg * 4) / 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusInfo: {
    flex: 1,
  },
  statusValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
  },
  statusLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  progressSection: {
    gap: spacing.md,
  },
  progressContainer: {
    marginBottom: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  progressValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.textSecondary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  specializationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specializationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  specializationNumber: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specializationNumberText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold as any,
  },
  specializationName: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
  specializationCount: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
  },
  performanceContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  performanceLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  performanceValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
  },
});
