import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";
import ModernCard from "../components/ModernCard";
import { getAppointmentsByPatient } from "../api/client";
import { AppointmentWithDetails } from "../types";

type Props = {
  navigation: any;
  route: any;
};

type Notification = {
  id: string;
  type: 'reminder' | 'confirmation' | 'update';
  title: string;
  message: string;
  date: Date;
  appointment?: AppointmentWithDetails;
  read: boolean;
};

export default function NotificationsScreen({ route, navigation }: Props) {
  const patient = route.params?.patient;
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (patient?.codigo) {
      loadAppointments();
    }
  }, [patient?.codigo]);

  useEffect(() => {
    if (appointments.length > 0) {
      generateNotifications();
    }
  }, [appointments]);

  const loadAppointments = async () => {
    try {
      const data = await getAppointmentsByPatient(patient.codigo);
      setAppointments(data);
    } catch (error: any) {
      console.error("Erro ao carregar consultas:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const generateNotifications = () => {
    const now = new Date();
    const generatedNotifications: Notification[] = [];

    appointments.forEach((apt) => {
      const aptDate = new Date(apt.data_hora);
      const timeDiff = aptDate.getTime() - now.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

      // Apenas gerar notificações para consultas futuras não canceladas
      if (timeDiff > 0 && apt.status !== 'cancelada' && apt.status !== 'concluida') {
        
        // Lembrete: consulta em 1 dia
        if (daysDiff === 1) {
          generatedNotifications.push({
            id: `reminder-1d-${apt.codigo}`,
            type: 'reminder',
            title: '🔔 Consulta Amanhã!',
            message: `Sua consulta em ${apt.clinicas?.nome || apt.clinica_nome} está marcada para amanhã às ${formatTime(apt.data_hora)}.`,
            date: new Date(aptDate.getTime() - 24 * 60 * 60 * 1000),
            appointment: apt,
            read: false,
          });
        }

        // Lembrete: consulta em 2 horas
        if (hoursDiff <= 2 && hoursDiff > 0) {
          generatedNotifications.push({
            id: `reminder-2h-${apt.codigo}`,
            type: 'reminder',
            title: '⏰ Consulta em Breve!',
            message: `Não esqueça! Sua consulta é daqui a ${hoursDiff} hora(s) em ${apt.clinicas?.nome || apt.clinica_nome}.`,
            date: new Date(aptDate.getTime() - 2 * 60 * 60 * 1000),
            appointment: apt,
            read: false,
          });
        }

        // Notificação de confirmação
        if (apt.status === 'confirmada' && daysDiff <= 7) {
          generatedNotifications.push({
            id: `confirmation-${apt.codigo}`,
            type: 'confirmation',
            title: '✅ Consulta Confirmada',
            message: `Sua consulta foi confirmada para ${formatDate(apt.data_hora)} às ${formatTime(apt.data_hora)} em ${apt.clinicas?.nome || apt.clinica_nome}.`,
            date: new Date(),
            appointment: apt,
            read: false,
          });
        }

        // Lembrete: consulta em 7 dias
        if (daysDiff === 7) {
          generatedNotifications.push({
            id: `reminder-7d-${apt.codigo}`,
            type: 'reminder',
            title: '📅 Consulta na Próxima Semana',
            message: `Lembrete: você tem uma consulta agendada para ${formatDate(apt.data_hora)} em ${apt.clinicas?.nome || apt.clinica_nome}.`,
            date: new Date(aptDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            appointment: apt,
            read: false,
          });
        }
      }
    });

    // Ordenar por data (mais recentes primeiro)
    generatedNotifications.sort((a, b) => b.date.getTime() - a.date.getTime());
    setNotifications(generatedNotifications);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return 'notifications';
      case 'confirmation': return 'checkmark-circle';
      case 'update': return 'information-circle';
      default: return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder': return colors.warning;
      case 'confirmation': return colors.success;
      case 'update': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (notification.appointment) {
      navigation.navigate('Appointments', { patient });
    }
  };

  const upcomingAppointmentsCount = appointments.filter(
    apt => new Date(apt.data_hora) > new Date() && apt.status !== 'cancelada'
  ).length;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ModernCard variant="elevated" style={styles.summaryCard}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="calendar" size={32} color={colors.primary} />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryCount}>{upcomingAppointmentsCount}</Text>
            <Text style={styles.summaryLabel}>
              {upcomingAppointmentsCount === 1 ? 'Consulta Agendada' : 'Consultas Agendadas'}
            </Text>
          </View>
        </View>
      </ModernCard>

      <View style={styles.notificationsSection}>
        <Text style={styles.sectionTitle}>Lembretes e Notificações</Text>

        {notifications.length === 0 ? (
          <ModernCard variant="outlined" style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
            <Text style={styles.emptySubtext}>
              Você receberá lembretes sobre suas consultas agendadas
            </Text>
          </ModernCard>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification)}
              activeOpacity={0.7}
            >
              <ModernCard
                variant="elevated"
                style={styles.notificationCard}
              >
                <View style={styles.notificationHeader}>
                  <View
                    style={[
                      styles.notificationIconContainer,
                      { backgroundColor: getNotificationColor(notification.type) + '20' },
                    ]}
                  >
                    <Ionicons
                      name={getNotificationIcon(notification.type) as any}
                      size={24}
                      color={getNotificationColor(notification.type)}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{getRelativeTime(notification.date)}</Text>
                  </View>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                {notification.appointment && (
                  <View style={styles.notificationFooter}>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                    <Text style={styles.notificationAction}>Ver detalhes da consulta</Text>
                  </View>
                )}
              </ModernCard>
            </TouchableOpacity>
          ))
        )}
      </View>

      <ModernCard variant="outlined" style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>Sobre as Notificações</Text>
        </View>
        <Text style={styles.infoText}>
          • Você receberá lembretes 7 dias antes da consulta{'\n'}
          • Um lembrete 1 dia antes da consulta{'\n'}
          • Um lembrete 2 horas antes da consulta{'\n'}
          • Notificações quando a clínica confirmar sua consulta
        </Text>
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
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryCount: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
  },
  summaryLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  notificationsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium as any,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  notificationCard: {
    marginBottom: spacing.md,
  },
  notificationRead: {
    opacity: 0.7,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
  },
  notificationTime: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  notificationMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notificationAction: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium as any,
  },
  infoCard: {
    marginBottom: spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
