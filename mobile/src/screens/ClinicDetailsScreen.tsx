import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import ModernCard from '../components/ModernCard';
import { getClinicById } from '../api/client';
import { Clinic } from '../types';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

type Props = {
  route: {
    params: {
      clinicId: number;
    };
  };
};

export default function ClinicDetailsScreen({ route }: Props) {
  const { clinicId } = route.params;
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinicDetails();
  }, []);

  const fetchClinicDetails = async () => {
    try {
      const clinicData = await getClinicById(clinicId);
      setClinic(clinicData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da clínica');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!clinic) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Clínica não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ModernCard>
        <View style={styles.clinicHeader}>
          <View style={styles.clinicImageContainer}>
            <Image 
              source={clinic.imagem ? { uri: clinic.imagem } : require('../../assets/clinic-placeholder.jpg')}
              style={styles.clinicImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>{clinic.nome}</Text>
            <Text style={styles.clinicAddress}>{clinic.endereco}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Contato</Text>
          <Text style={styles.infoText}>📞 {clinic.fone}</Text>
          <Text style={styles.infoText}>✉️ {clinic.email}</Text>
        </View>

        {clinic.especializacoes && clinic.especializacoes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Especializações</Text>
            <View style={styles.specializationsContainer}>
              {clinic.especializacoes.map((spec, index) => (
                <View key={index} style={styles.specializationTag}>
                  <Text style={styles.specializationText}>{spec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ModernCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.onBackground,
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
  clinicHeader: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  clinicImageContainer: {
    marginRight: spacing.md,
  },
  clinicImage: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  clinicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  clinicName: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  clinicAddress: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.onBackground,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specializationTag: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  specializationText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});