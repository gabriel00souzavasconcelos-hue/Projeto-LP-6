import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
} from "../styles/theme";

type Props = {
  navigation: any;
  route: any;
};

const menuActions = [
  {
    id: "clinics",
    label: "Buscar Clínicas",
    icon: "search-outline" as const,
    screen: "ClinicList",
    color: colors.primary,
  },
  {
    id: "appointments",
    label: "Consultas",
    icon: "calendar-outline" as const,
    screen: "Appointments",
    color: colors.success,
  },
  {
    id: "notifications",
    label: "Notificações",
    icon: "notifications-outline" as const,
    screen: "Notifications",
    color: colors.warning,
  },
  {
    id: "documents",
    label: "Documentos",
    icon: "folder-open-outline" as const,
    screen: "PatientDocuments",
    color: colors.error,
  },
];

export default function PatientMenu({ route, navigation }: Props) {
  const patient = route.params?.patient;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-circle" size={56} color={colors.surface} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Olá,</Text>
            <Text style={styles.patientName}>
              {patient?.nome || "Paciente"}
            </Text>
          </View>
        </View>
        <Text style={styles.subtitle}>O que você gostaria de fazer hoje?</Text>
      </LinearGradient>

      <ModernCard variant="elevated" style={styles.patientCard}>
        <View style={styles.patientInfoRow}>
          <View style={styles.patientInfoLeft}>
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
          <ModernButton
            title="Editar"
            onPress={() => navigation.navigate("PatientEdit", { patient })}
            variant="outline"
            size="small"
          />
        </View>
      </ModernCard>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Ações Disponíveis</Text>
        <View style={styles.actionsGrid}>
          {menuActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.screen, { patient })}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: action.color + "20" },
                ]}
              >
                <Ionicons name={action.icon} size={32} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

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
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    marginBottom: -spacing.lg, // Negative margin to pull cards up
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: fontSize.lg,
    color: colors.onPrimary,
    opacity: 0.9,
  },
  patientName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    textAlign: "left",
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.onPrimary,
    textAlign: "center",
    opacity: 0.9,
    marginTop: spacing.lg,
  },
  patientCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  patientInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  patientInfoLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  actionsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%", // Two columns with a bit of space
    aspectRatio: 1, // Make it a square
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.small,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.round,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  actionLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlign: "center",
  },
  logoutContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: "auto",
    paddingTop: spacing.lg,
  },
});
