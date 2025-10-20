import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from "../navigation";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from "../styles/theme";

type Props = {
  navigation: any;
  route: any;
};

export default function PatientMenu({ route, navigation }: Props) {
  const patient = route.params?.patient;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerTop}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-circle" size={56} color={colors.surface} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Olá,</Text>
            <Text style={styles.patientName}>{patient?.nome || "Paciente"}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>O que você gostaria de fazer hoje?</Text>
      </LinearGradient>

      <ModernCard variant="elevated" style={styles.patientCard}>
        <View style={styles.patientInfoRow}>
          <View style={styles.patientInfoLeft}>
            <Text style={styles.cardTitle}>Suas Informações</Text>
            {patient?.email && <Text style={styles.infoText}>📧 {patient.email}</Text>}
            {patient?.fone && <Text style={styles.infoText}>📱 {patient.fone}</Text>}
            {patient?.ende && <Text style={styles.infoText}>📍 {patient.ende}</Text>}
          </View>
          <ModernButton title="Editar" onPress={() => navigation.navigate('PatientEdit', { patient })} variant="outline" size="small" />
        </View>
      </ModernCard>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Ações Disponíveis</Text>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>🏥 Buscar Clínicas</Text>
              <Text style={styles.actionDescription}>Encontre clínicas especializadas próximas a você</Text>
            </View>
            <ModernButton title="Ver Clínicas" onPress={() => navigation.navigate("ClinicList", { patient })} size="small" />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>👨‍⚕️ Consultas</Text>
              <Text style={styles.actionDescription}>Gerencie suas consultas e histórico médico</Text>
            </View>
            <ModernButton title="Ver Consultas" onPress={() => navigation.navigate("Appointments", { patient })} size="small" />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>🔔 Notificações</Text>
              <Text style={styles.actionDescription}>Receba lembretes sobre consultas e exames</Text>
            </View>
            <ModernButton title="Ver Lembretes" onPress={() => navigation.navigate("Notifications", { patient })} size="small" />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>📄 Documentos Médicos</Text>
              <Text style={styles.actionDescription}>Gerencie seus exames, receitas e laudos</Text>
            </View>
            <ModernButton title="Ver Documentos" onPress={() => navigation.navigate("PatientDocuments", { patient })} size="small" />
          </View>
        </ModernCard>
      </View>

      <View style={styles.logoutContainer}>
        <ModernButton title="Sair da Conta" onPress={() => navigation.replace("Login")} variant="outline" size="medium" fullWidth />
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
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: fontSize.lg,
    color: colors.onPrimary,
    marginBottom: spacing.xs,
  },
  patientName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  patientCard: {
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientInfoLeft: {
    flex: 1,
    marginRight: spacing.md,
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
