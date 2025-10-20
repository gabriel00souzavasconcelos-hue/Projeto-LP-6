import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";
import ModernCard from "../components/ModernCard";
import ModernButton from "../components/ModernButton";
import ModernInput from "../components/ModernInput";
import { createAppointment, getAvailableSlots, getClinicSpecializations } from "../api/client";
import { Specialization } from "../types";

type Props = {
  navigation: any;
  route: any;
};

export default function BookAppointmentScreen({ route, navigation }: Props) {
  const { clinic, patient } = route.params;
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSpecializations();
  }, []);

  const loadSpecializations = async () => {
    try {
      const data = await getClinicSpecializations(clinic.codigo);
      setSpecializations(data);
    } catch (error) {
      console.error("Erro ao carregar especializações:", error);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot("");
    
    if (date && clinic.codigo) {
      try {
        const slots = await getAvailableSlots(clinic.codigo, date);
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
        Alert.alert("Erro", "Não foi possível carregar os horários disponíveis");
      }
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSpecialization) {
      Alert.alert("Atenção", "Selecione uma especialização");
      return;
    }
    
    if (!selectedDate) {
      Alert.alert("Atenção", "Selecione uma data");
      return;
    }
    
    if (!selectedSlot) {
      Alert.alert("Atenção", "Selecione um horário");
      return;
    }

    try {
      setLoading(true);
      
      await createAppointment({
        codigo_paciente: patient.codigo,
        codigo_clinica: clinic.codigo,
        codigo_especializacao: selectedSpecialization,
        data_hora: selectedSlot,
        status: 'agendada',
        observacoes: observacoes || undefined,
      });

      Alert.alert("Sucesso", "Consulta agendada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error("Erro ao agendar consulta:", error);
      Alert.alert("Erro", "Não foi possível agendar a consulta");
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatSlotTime = (slot: string) => {
    const date = new Date(slot);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container}>
      <ModernCard variant="elevated" style={styles.clinicCard}>
        <Text style={styles.clinicName}>{clinic.nome}</Text>
        <Text style={styles.clinicInfo}>📍 {clinic.endereco}</Text>
        {clinic.fone && <Text style={styles.clinicInfo}>📞 {clinic.fone}</Text>}
      </ModernCard>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Especialização</Text>
        <View style={styles.specializationsContainer}>
          {specializations.map((spec) => (
            <TouchableOpacity
              key={spec.codigo}
              style={[
                styles.specializationChip,
                selectedSpecialization === spec.codigo && styles.specializationChipSelected
              ]}
              onPress={() => setSelectedSpecialization(spec.codigo!)}
            >
              <Text style={[
                styles.specializationText,
                selectedSpecialization === spec.codigo && styles.specializationTextSelected
              ]}>
                {spec.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Data da Consulta</Text>
        <ModernInput
          placeholder="Selecione a data"
          value={selectedDate}
          onChangeText={handleDateChange}
          icon="calendar-outline"
        />
        <Text style={styles.helperText}>Formato: AAAA-MM-DD (Ex: 2025-10-25)</Text>
      </View>

      {availableSlots.length > 0 && (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Horários Disponíveis</Text>
          <View style={styles.slotsContainer}>
            {availableSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotChip,
                  selectedSlot === slot && styles.slotChipSelected
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Ionicons 
                  name="time-outline" 
                  size={16} 
                  color={selectedSlot === slot ? colors.surface : colors.primary} 
                />
                <Text style={[
                  styles.slotText,
                  selectedSlot === slot && styles.slotTextSelected
                ]}>
                  {formatSlotTime(slot)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {selectedDate && availableSlots.length === 0 && (
        <ModernCard variant="outlined" style={styles.noSlotsCard}>
          <Ionicons name="sad-outline" size={40} color={colors.textSecondary} />
          <Text style={styles.noSlotsText}>Nenhum horário disponível para esta data</Text>
          <Text style={styles.noSlotsSubtext}>Tente selecionar outra data</Text>
        </ModernCard>
      )}

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Observações (opcional)</Text>
        <ModernInput
          placeholder="Ex: Primeira consulta, sintomas específicos..."
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={4}
          icon="chatbox-outline"
        />
      </View>

      <View style={styles.buttonContainer}>
        <ModernButton
          title={loading ? "Agendando..." : "Confirmar Agendamento"}
          onPress={handleBookAppointment}
          disabled={loading || !selectedSpecialization || !selectedDate || !selectedSlot}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  clinicCard: {
    marginBottom: spacing.lg,
  },
  clinicName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  clinicInfo: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  specializationChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  specializationChipSelected: {
    backgroundColor: colors.primary,
  },
  specializationText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium as any,
  },
  specializationTextSelected: {
    color: colors.surface,
  },
  helperText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  slotChipSelected: {
    backgroundColor: colors.primary,
  },
  slotText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.medium as any,
  },
  slotTextSelected: {
    color: colors.surface,
  },
  noSlotsCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  noSlotsText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  noSlotsSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
