import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";
import ModernCard from "../components/ModernCard";
import { getAppointmentsByClinic } from "../api/client";
import { AppointmentWithDetails } from "../types";

type Props = {
  navigation: any;
  route: any;
};

export default function ClinicAgendaScreen({ route }: Props) {
  const clinic = route.params?.clinic;
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clinic?.codigo) {
      loadAppointments();
    }
  }, [clinic?.codigo]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointmentsByClinic(clinic.codigo);
      setAppointments(data);
    } catch (error: any) {
      console.error("Erro ao carregar agenda:", error);
      Alert.alert("Erro", "Não foi possível carregar a agenda");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  // Gerar dias do mês atual
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Adicionar dias vazios antes do primeiro dia
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Adicionar todos os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Contar consultas por dia
  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.data_hora).toISOString().split('T')[0];
      return aptDate === dateStr && apt.status !== 'cancelada';
    });
  };

  // Obter consultas do dia selecionado
  const selectedDateAppointments = getAppointmentsForDate(selectedDate)
    .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime());

  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return colors.warning;
      case 'confirmada': return colors.success;
      case 'concluida': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const days = getDaysInMonth(selectedDate);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ModernCard variant="elevated" style={styles.calendarCard}>
        {/* Header do Calendário */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.monthYear}>{formatMonthYear(selectedDate)}</Text>
          
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Dias da Semana */}
        <View style={styles.weekDaysContainer}>
          {weekDays.map((day, index) => (
            <View key={index} style={styles.weekDayCell}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Grade de Dias */}
        <View style={styles.daysGrid}>
          {days.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day);
            const hasAppointments = dayAppointments.length > 0;
            const isSelected = day && isSameDay(day, selectedDate);
            const isTodayDay = isToday(day);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !day && styles.emptyCell,
                  isSelected && styles.selectedDay,
                  isTodayDay && !isSelected && styles.todayCell,
                ]}
                onPress={() => day && setSelectedDate(day)}
                disabled={!day}
              >
                {day && (
                  <>
                    <Text style={[
                      styles.dayNumber,
                      isSelected && styles.selectedDayText,
                      isTodayDay && !isSelected && styles.todayText,
                    ]}>
                      {day.getDate()}
                    </Text>
                    {hasAppointments && (
                      <View style={[
                        styles.appointmentIndicator,
                        isSelected && styles.appointmentIndicatorSelected
                      ]}>
                        <Text style={[
                          styles.appointmentCount,
                          isSelected && styles.appointmentCountSelected
                        ]}>
                          {dayAppointments.length}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ModernCard>

      {/* Consultas do Dia Selecionado */}
      <View style={styles.appointmentsSection}>
        <Text style={styles.sectionTitle}>
          Consultas de {selectedDate.toLocaleDateString('pt-BR')}
        </Text>
        
        {selectedDateAppointments.length === 0 ? (
          <ModernCard variant="outlined" style={styles.emptyCard}>
            <Ionicons name="calendar-clear-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhuma consulta agendada</Text>
            <Text style={styles.emptySubtext}>para este dia</Text>
          </ModernCard>
        ) : (
          selectedDateAppointments.map((apt) => (
            <ModernCard key={apt.codigo} variant="elevated" style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <View style={styles.timeContainer}>
                  <Ionicons name="time" size={20} color={colors.primary} />
                  <Text style={styles.timeText}>{formatTime(apt.data_hora)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(apt.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(apt.status) }]}>
                    {apt.status}
                  </Text>
                </View>
              </View>

              <View style={styles.appointmentBody}>
                <View style={styles.patientInfo}>
                  <Ionicons name="person" size={18} color={colors.text} />
                  <Text style={styles.patientName}>
                    {apt.pacientes?.nome || apt.paciente_nome}
                  </Text>
                </View>

                <View style={styles.specializationInfo}>
                  <Ionicons name="medical" size={18} color={colors.primary} />
                  <Text style={styles.specializationText}>
                    {apt.especializacoes?.nome || apt.especializacao_nome}
                  </Text>
                </View>

                {apt.pacientes?.fone && (
                  <View style={styles.contactInfo}>
                    <Ionicons name="call" size={16} color={colors.textSecondary} />
                    <Text style={styles.contactText}>{apt.pacientes.fone}</Text>
                  </View>
                )}

                {apt.observacoes && (
                  <View style={styles.observationsContainer}>
                    <Ionicons name="document-text" size={16} color={colors.textSecondary} />
                    <Text style={styles.observationsText}>{apt.observacoes}</Text>
                  </View>
                )}
              </View>
            </ModernCard>
          ))
        )}
      </View>

      {/* Legenda */}
      <ModernCard variant="outlined" style={styles.legendCard}>
        <Text style={styles.legendTitle}>Legenda</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.warning + '30' }]} />
            <Text style={styles.legendText}>Agendada</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.success + '30' }]} />
            <Text style={styles.legendText}>Confirmada</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.textSecondary + '30' }]} />
            <Text style={styles.legendText}>Concluída</Text>
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
  calendarCard: {
    marginBottom: spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthButton: {
    padding: spacing.sm,
  },
  monthYear: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    textTransform: 'capitalize',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  weekDayText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
    position: 'relative',
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  selectedDay: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  dayNumber: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.text,
  },
  selectedDayText: {
    color: colors.surface,
    fontWeight: fontWeight.bold as any,
  },
  todayText: {
    color: colors.primary,
    fontWeight: fontWeight.bold as any,
  },
  appointmentIndicator: {
    position: 'absolute',
    bottom: 2,
    minWidth: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  appointmentIndicatorSelected: {
    backgroundColor: colors.surface,
  },
  appointmentCount: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold as any,
    color: colors.surface,
  },
  appointmentCountSelected: {
    color: colors.primary,
  },
  appointmentsSection: {
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
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  appointmentCard: {
    marginBottom: spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
    textTransform: 'capitalize',
  },
  appointmentBody: {
    gap: spacing.sm,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  patientName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
  },
  specializationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  specializationText: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  observationsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  observationsText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  legendCard: {
    marginBottom: spacing.xl,
  },
  legendTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.sm,
  },
  legendText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
