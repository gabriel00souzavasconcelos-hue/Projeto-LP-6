import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";
import ModernCard from "../components/ModernCard";
import ModernButton from "../components/ModernButton";
import { getAppointmentsByPatient, updateAppointmentStatus } from "../api/client";
import { AppointmentWithDetails } from "../types";

type Props = {
  navigation: any;
  route: any;
};

export default function AppointmentsScreen({ route, navigation }: Props) {
  const patient = route.params?.patient;
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patient?.codigo) {
      loadAppointments();
    }
  }, [patient?.codigo]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointmentsByPatient(patient.codigo);
      setAppointments(data);
    } catch (error: any) {
      console.error("Erro ao carregar consultas:", error);
      Alert.alert("Erro", "Não foi possível carregar as consultas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const handleCancelAppointment = (codigo: number) => {
    Alert.alert(
      "Cancelar Consulta",
      "Tem certeza que deseja cancelar esta consulta?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: async () => {
            try {
              await updateAppointmentStatus(codigo, 'cancelada');
              Alert.alert("Sucesso", "Consulta cancelada com sucesso");
              loadAppointments();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível cancelar a consulta");
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return colors.warning;
      case 'confirmada': return colors.success;
      case 'cancelada': return colors.error;
      case 'concluida': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendada': return 'time-outline';
      case 'confirmada': return 'checkmark-circle-outline';
      case 'cancelada': return 'close-circle-outline';
      case 'concluida': return 'checkmark-done-outline';
      default: return 'help-outline';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const upcomingAppointments = appointments.filter(
    apt => apt.status !== 'cancelada' && apt.status !== 'concluida' && new Date(apt.data_hora) >= new Date()
  );

  const pastAppointments = appointments.filter(
    apt => apt.status === 'concluida' || apt.status === 'cancelada' || new Date(apt.data_hora) < new Date()
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Consultas</Text>
        <ModernButton
          title="Agendar Nova"
          onPress={() => navigation.navigate("ClinicList")}
          size="small"
        />
      </View>

      {/* Próximas Consultas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximas Consultas ({upcomingAppointments.length})</Text>
        {upcomingAppointments.length === 0 ? (
          <ModernCard variant="outlined" style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhuma consulta agendada</Text>
            <Text style={styles.emptySubtext}>Encontre uma clínica e agende sua consulta</Text>
          </ModernCard>
        ) : (
          upcomingAppointments.map((apt) => {
            const { date, time } = formatDateTime(apt.data_hora);
            return (
              <ModernCard key={apt.codigo} variant="elevated" style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentDate}>
                    <Ionicons name="calendar" size={20} color={colors.primary} />
                    <Text style={styles.dateText}>{date}</Text>
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(apt.status) + '20' }]}>
                    <Ionicons name={getStatusIcon(apt.status) as any} size={16} color={getStatusColor(apt.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(apt.status) }]}>
                      {apt.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentBody}>
                  <Text style={styles.clinicName}>{apt.clinicas?.nome || apt.clinica_nome}</Text>
                  <Text style={styles.specializationText}>
                    {apt.especializacoes?.nome || apt.especializacao_nome}
                  </Text>
                  {apt.clinicas?.endereco && (
                    <Text style={styles.addressText}>📍 {apt.clinicas.endereco}</Text>
                  )}
                  {apt.observacoes && (
                    <Text style={styles.observationsText}>💬 {apt.observacoes}</Text>
                  )}
                </View>

                {apt.status === 'agendada' && (
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelAppointment(apt.codigo!)}
                    >
                      <Ionicons name="close-circle-outline" size={20} color={colors.error} />
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ModernCard>
            );
          })
        )}
      </View>

      {/* Histórico */}
      {pastAppointments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico ({pastAppointments.length})</Text>
          {pastAppointments.map((apt) => {
            const { date, time } = formatDateTime(apt.data_hora);
            return (
              <ModernCard key={apt.codigo} variant="outlined" style={styles.pastAppointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentDate}>
                    <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                    <Text style={styles.pastDateText}>{date} - {time}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(apt.status) + '20' }]}>
                    <Ionicons name={getStatusIcon(apt.status) as any} size={14} color={getStatusColor(apt.status)} />
                    <Text style={[styles.statusTextSmall, { color: getStatusColor(apt.status) }]}>
                      {apt.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.pastClinicName}>{apt.clinicas?.nome || apt.clinica_nome}</Text>
                <Text style={styles.pastSpecialization}>
                  {apt.especializacoes?.nome || apt.especializacao_nome}
                </Text>
              </ModernCard>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
  },
  section: {
    padding: spacing.lg,
    paddingTop: 0,
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
  appointmentCard: {
    marginBottom: spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  appointmentDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
  },
  timeText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    textTransform: 'capitalize',
  },
  statusTextSmall: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
    textTransform: 'capitalize',
  },
  appointmentBody: {
    marginBottom: spacing.sm,
  },
  clinicName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  specializationText: {
    fontSize: fontSize.md,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  observationsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  cancelButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: colors.error,
  },
  pastAppointmentCard: {
    marginBottom: spacing.sm,
    opacity: 0.8,
  },
  pastDateText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  pastClinicName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginTop: spacing.xs,
  },
  pastSpecialization: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
