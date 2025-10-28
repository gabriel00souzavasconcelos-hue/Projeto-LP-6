import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";

type Props = {
  navigation: any;
  route: any;
};

export default function ClinicMenu({ route, navigation }: Props) {
  const clinic = route.params?.clinic;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <Ionicons name="business-outline" size={50} color={colors.onPrimary} />
        <Text style={styles.headerTitle}>Painel da Clínica</Text>
        <Text style={styles.headerSubtitle}>{clinic?.nome || "Clínica"}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
      <ModernCard variant="elevated" style={styles.clinicCard}>
        <View style={styles.clinicInfo}>
          <View style={styles.clinicHeader}>
            <View style={styles.clinicImageContainer}>
              {clinic?.imagem ? (
                <Image source={{ uri: clinic.imagem }} style={styles.clinicImage} />
              ) : (
                <View style={styles.clinicPlaceholder}>
                  <Text style={styles.clinicPlaceholderText}>🏥</Text>
                </View>
              )}
            </View>
            <View style={styles.clinicDetails}>
              <Text style={styles.cardTitle}>{clinic?.nome}</Text>
              {clinic?.endereco && (
                <Text style={styles.infoText}>📍 {clinic.endereco}</Text>
              )}
              {clinic?.fone && (
                <Text style={styles.infoText}>📞 {clinic.fone}</Text>
              )}
              {clinic?.email && (
                <Text style={styles.infoText}>📧 {clinic.email}</Text>
              )}
            </View>
          </View>
        </View>
      </ModernCard>

      
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Gerenciamento</Text>
        
        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>✏️ Editar Dados</Text>
              <Text style={styles.actionDescription}>
                Atualize informações da clínica, endereço e contatos
              </Text>
            </View>
            <ModernButton
              title="Editar"
              onPress={() => navigation.navigate("ClinicEdit", { clinic })}
              size="small"
            />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>⚕️ Especialidades</Text>
              <Text style={styles.actionDescription}>
                Gerencie as especialidades médicas da clínica
              </Text>
            </View>
            <ModernButton
              title="Gerenciar"
              onPress={() => navigation.navigate("SpecializationsScreen", { clinicCode: clinic?.codigo })}
              size="small"
            />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>👥 Pacientes</Text>
              <Text style={styles.actionDescription}>
                Gerencie consultas e histórico dos pacientes
              </Text>
            </View>
            <ModernButton
              title="Gerenciar"
              onPress={() => navigation.navigate("ClinicPatients", { clinic })}
              size="small"
            />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>📅 Agenda</Text>
              <Text style={styles.actionDescription}>
                Visualize e gerencie seus horários de atendimento
              </Text>
            </View>
            <ModernButton
              title="Ver Agenda"
              onPress={() => navigation.navigate("ClinicAgenda", { clinic })}
              size="small"
            />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>📊 Relatórios</Text>
              <Text style={styles.actionDescription}>
                Visualize estatísticas e relatórios da clínica
              </Text>
            </View>
            <ModernButton
              title="Ver Relatórios"
              onPress={() => navigation.navigate("ClinicReports", { clinic })}
              size="small"
            />
          </View>
        </ModernCard>

        <ModernCard variant="outlined" style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>📄 Documentos</Text>
              <Text style={styles.actionDescription}>
                Gerencie documentos médicos dos pacientes
              </Text>
            </View>
            <ModernButton
              title="Gerenciar"
              onPress={() => navigation.navigate("ClinicDocuments", { clinic })}
              size="small"
            />
          </View>
        </ModernCard>
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    textAlign: "center",
    marginTop: spacing.md,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.onPrimary,
    textAlign: "center",
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  contentContainer: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: -spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  clinicCard: {
    marginBottom: spacing.lg,
  },
  clinicInfo: {
    gap: spacing.sm,
  },
  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  clinicImageContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  clinicImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  clinicPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicPlaceholderText: {
    fontSize: fontSize.xxl,
  },
  clinicDetails: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
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
