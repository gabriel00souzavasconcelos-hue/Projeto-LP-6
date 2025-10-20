import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Painel da Clínica 🏥</Text>
        <Text style={styles.clinicName}>{clinic?.nome || "Clínica"}</Text>
        <Text style={styles.subtitle}>Gerencie sua clínica</Text>
      </View>

      
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
  clinicName: {
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
