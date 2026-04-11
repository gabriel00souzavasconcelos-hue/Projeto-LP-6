import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ModernButton from '../components/ModernButton';
import ModernCard from '../components/ModernCard';
import { PremiumActionCard, SubscriptionBanner } from '../components/PremiumGate';
import { useClinic } from '../contexts/ClinicContexts';
import { authLogout, getClinicById } from '../api/client';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../styles/theme';

type Props = {
  navigation: any;
  route: any;
};

export default function ClinicMenu({ route, navigation }: Props) {
  const routeClinic = route.params?.clinic;
  const [clinic, setClinic] = useState(routeClinic ?? null);
  const { subscription, refreshSubscription, clearSession } = useClinic();

  useEffect(() => {
    if (routeClinic) {
      setClinic(routeClinic);
    }
  }, [routeClinic]);

  const refreshClinicData = useCallback(async () => {
    if (!routeClinic?.codigo) return;
    try {
      const updatedClinic = await getClinicById(routeClinic.codigo);
      setClinic(updatedClinic);
    } catch (error) {
      console.warn('Não foi possível recarregar dados atualizados da clínica.', error);
    }
  }, [routeClinic?.codigo]);

  useFocusEffect(
    useCallback(() => {
      refreshClinicData();
    }, [refreshClinicData])
  );

  const handleUpgradePress = () => {
    Alert.alert(
      'Upgrade de Plano',
      'Você será redirecionado para a página de planos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ver planos',
          onPress: () => {
            // navigation.navigate('Planos') ou Linking.openURL(...)
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await authLogout();   // limpa o JWT do AsyncStorage
    clearSession();       // limpa subscription e clinic do contexto
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <Ionicons name="business-outline" size={50} color={colors.onPrimary} />
        <Text style={styles.headerTitle}>Painel da Clínica</Text>
        <Text style={styles.headerSubtitle}>{clinic?.nome || 'Clínica'}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>

          {/* Info da clínica */}
          <ModernCard variant="elevated" style={styles.clinicCard}>
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
                {clinic?.endereco && <Text style={styles.infoText}>📍 {clinic.endereco}</Text>}
                {clinic?.fone && <Text style={styles.infoText}>📞 {clinic.fone}</Text>}
                {clinic?.email && <Text style={styles.infoText}>📧 {clinic.email}</Text>}
              </View>
            </View>
          </ModernCard>

          {/* Banner de upsell — só exibe se plano básico ou trial ativo */}
          <SubscriptionBanner onUpgradePress={handleUpgradePress} />

          {/* ============ FUNCIONALIDADES GRATUITAS ============ */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Gerenciamento</Text>

            <ModernCard variant="outlined" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>✏️ Editar Dados</Text>
                  <Text style={styles.actionDescription}>Atualize informações da clínica</Text>
                </View>
                <ModernButton
                  title="Editar"
                  onPress={() => navigation.navigate('ClinicEdit', { clinic })}
                  size="small"
                />
              </View>
            </ModernCard>

            <ModernCard variant="outlined" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>⚕️ Especialidades</Text>
                  <Text style={styles.actionDescription}>Gerencie as especialidades médicas</Text>
                </View>
                <ModernButton
                  title="Gerenciar"
                  onPress={() => navigation.navigate('SpecializationsScreen', { clinicCode: clinic?.codigo })}
                  size="small"
                />
              </View>
            </ModernCard>

            <ModernCard variant="outlined" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>👥 Pacientes</Text>
                  <Text style={styles.actionDescription}>Consultas e histórico dos pacientes</Text>
                </View>
                <ModernButton
                  title="Gerenciar"
                  onPress={() => navigation.navigate('ClinicPatients', { clinic })}
                  size="small"
                />
              </View>
            </ModernCard>

            <ModernCard variant="outlined" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>📅 Agenda</Text>
                  <Text style={styles.actionDescription}>Horários e atendimentos</Text>
                </View>
                <ModernButton
                  title="Ver Agenda"
                  onPress={() => navigation.navigate('ClinicAgenda', { clinic })}
                  size="small"
                />
              </View>
            </ModernCard>

            <ModernCard variant="outlined" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>📊 Relatórios Básicos</Text>
                  <Text style={styles.actionDescription}>Estatísticas gerais da clínica</Text>
                </View>
                <ModernButton
                  title="Ver"
                  onPress={() => navigation.navigate('ClinicReports', { clinic })}
                  size="small"
                />
              </View>
            </ModernCard>

            <ModernCard variant="outlined" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>📄 Documentos</Text>
                  <Text style={styles.actionDescription}>Documentos médicos dos pacientes</Text>
                </View>
                <ModernButton
                  title="Gerenciar"
                  onPress={() => navigation.navigate('ClinicDocuments', { clinic })}
                  size="small"
                />
              </View>
            </ModernCard>
          </View>

          {/* ============ FUNCIONALIDADES PREMIUM ============ */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Funcionalidades Premium</Text>
            <Text style={styles.sectionSubtitle}>
              {subscription?.plano === 'basico'
                ? 'Faça upgrade para desbloquear estas funcionalidades'
                : `Plano ${subscription?.plano} ativo`}
            </Text>

            {/* Telemedicina — protegida por addon_telemedicina */}
            <PremiumActionCard
              addon="addon_telemedicina"
              onPress={() => navigation.navigate('Telemedicina', { clinic })}
            />

            {/* PDF — protegida por addon_pdf */}
            <PremiumActionCard
              addon="addon_pdf"
              onPress={() => navigation.navigate('GerarPDF', { clinic })}
            />

            {/* Relatórios Avançados — protegida por addon_relatorios */}
            <PremiumActionCard
              addon="addon_relatorios"
              onPress={() => navigation.navigate('RelatoriosAvancados', { clinic })}
            />

            {/* API Externa — protegida por addon_api_externa */}
            <PremiumActionCard
              addon="addon_api_externa"
              onPress={() => navigation.navigate('APIExterna', { clinic })}
            />
          </View>

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <ModernButton
              title="Sair da Conta"
              onPress={handleLogout}
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
  container: { flex: 1, backgroundColor: colors.background },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.onPrimary, marginTop: spacing.md },
  headerSubtitle: { fontSize: fontSize.md, color: colors.onPrimary, marginTop: spacing.xs, opacity: 0.9 },
  contentContainer: { flexGrow: 1, padding: spacing.lg },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: -spacing.xl,
    ...Platform.select({
      ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 8 },
    }),
  },
  clinicCard: { marginBottom: spacing.md },
  clinicHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  clinicImageContainer: { width: 80, height: 80, borderRadius: borderRadius.md, overflow: 'hidden' },
  clinicImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  clinicPlaceholder: { width: '100%', height: '100%', backgroundColor: colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  clinicPlaceholderText: { fontSize: fontSize.xxl },
  clinicDetails: { flex: 1, gap: spacing.xs },
  cardTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text, marginBottom: spacing.xs },
  infoText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  actionsContainer: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text, marginBottom: 2 },
  sectionSubtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  actionCard: { marginBottom: spacing.md },
  actionContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionInfo: { flex: 1, marginRight: spacing.md },
  actionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text, marginBottom: spacing.xs },
  actionDescription: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  logoutContainer: { marginTop: spacing.lg },
});