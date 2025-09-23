// src/screens/PatientMenu.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RootStackParamList } from "../navigation";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";

type Props = {
  navigation: any;
  route: any;
};

export default function PatientMenu({ route, navigation }: Props) {
  const patient = route.params?.patient;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá! 👋</Text>
        <Text style={styles.patientName}>{patient?.nome || "Paciente"}</Text>
        <Text style={styles.subtitle}>O que você gostaria de fazer hoje?</Text>
      </View>

      {/* Patient Info Card */}
      <ModernCard variant="elevated" style={styles.patientCard}>
        <View style={styles.patientInfo}>
          <Text style={styles.cardTitle}>Suas Informações</Text>
          {patient?.email && (
            <Text style={styles.infoText}>📧 {patient.email}</Text>
          )}
          {patient?.fone && (
            <Text style={styles.infoText}>📱 {patient.fone}</Text>
          )}
          {patient?.ende && (
            <Text style={styles.infoText}>📍 {patient.ende}</Text>
          )}
        </View>
      </ModernCard>

      {/* Action Cards */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Ações Disponíveis</Text>
        
        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>🏥 Buscar Clínicas</Text>
              <Text style={styles.actionDescription}>
                Encontre clínicas especializadas próximas a você
              </Text>
            </View>
            <ModernButton
              title="Ver Clínicas"
              onPress={() => navigation.navigate("ClinicList")}
              size="small"
            />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>👨‍⚕️ Consultas</Text>
              <Text style={styles.actionDescription}>
                Gerencie suas consultas e histórico médico
              </Text>
            </View>
            <ModernButton
              title="Em breve"
              onPress={() => {}}
              variant="ghost"
              size="small"
              disabled
            />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>🔔 Notificações</Text>
              <Text style={styles.actionDescription}>
                Receba lembretes sobre consultas e exames
              </Text>
            </View>
            <ModernButton
              title="Em breve"
              onPress={() => {}}
              variant="ghost"
              size="small"
              disabled
            />
          </View>
        </ModernCard>
      </View>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <ModernButton
          title="Sair da Conta"
          onPress={() => navigation.replace("Login")}
          variant="outline"
          size="medium"
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
  },
  contentContainer: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  welcomeText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  patientName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  patientCard: {
    marginBottom: spacing.lg,
  },
  patientInfo: {
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  actionsContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionCard: {
    marginBottom: spacing.md,
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  actionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
  },
});
