import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ClinicCard from "../components/ClinicCard";
import ModernInput from "../components/ModernInput";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
} from "../styles/theme";
import { getClinics } from "../api/client";
import { Clinic } from "../types";
import { useSpecializations } from "../hooks/useSpecializations";

const { width } = Dimensions.get('window');

type Props = {
  navigation: any;
};

export default function ClinicList({ navigation }: Props) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { specializations } = useSpecializations();

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const data = await getClinics();
      setClinics(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as clínicas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const filteredClinics = useMemo(() => {
    let filtered = clinics;

    if (activeFilter) {
      filtered = filtered.filter((clinic) =>
        clinic.especializacoes?.includes(activeFilter)
      );
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (clinic) =>
          clinic.nome.toLowerCase().includes(lowercasedTerm) ||
          clinic.endereco?.toLowerCase().includes(lowercasedTerm)
      );
    }

    return filtered;
  }, [clinics, searchTerm, activeFilter]);

  const onRefresh = () => {
    setSearchTerm("");
    setActiveFilter(null);
    fetchClinics();
  };

  const renderClinicItem = ({ item }: { item: Clinic }) => (
    <ClinicCard
      clinic={item}
      onPress={() => navigation.navigate("ClinicDetails", { clinicId: item.codigo })}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="medical-outline" size={64} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyStateTitle}>Nenhuma clínica encontrada</Text>
      <Text style={styles.emptyStateText}>
        {searchTerm || activeFilter 
          ? "Tente ajustar sua busca ou filtros para encontrar mais resultados"
          : "Não há clínicas disponíveis no momento"
        }
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Ionicons name="refresh-outline" size={20} color={colors.primary} />
        <Text style={styles.refreshButtonText}>Recarregar</Text>
      </TouchableOpacity>
    </View>
  );

  const SpecializationFilters = () => (
    <View style={styles.filtersSection}>
      <View style={styles.filterHeader}>
        <Ionicons name="options-outline" size={18} color={colors.primary} />
        <Text style={styles.filterHeaderText}>Especialidades</Text>
        {activeFilter && (
          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => setActiveFilter(null)}
          >
            <Text style={styles.clearFilterText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <TouchableOpacity
          style={[styles.filterChip, !activeFilter && styles.filterChipActive]}
          onPress={() => setActiveFilter(null)}
        >
          <Ionicons 
            name="apps-outline" 
            size={16} 
            color={!activeFilter ? colors.onPrimary : colors.primary} 
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, !activeFilter && styles.filterTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        {specializations.map((spec) => (
          <TouchableOpacity
            key={spec.codigo}
            style={[
              styles.filterChip,
              activeFilter === spec.nome && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(spec.nome)}
          >
            <Ionicons 
              name="medical-outline" 
              size={16} 
              color={activeFilter === spec.nome ? colors.onPrimary : colors.primary} 
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === spec.nome && styles.filterTextActive,
              ]}
            >
              {spec.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Ionicons name="medical" size={28} color={colors.onPrimary} />
            <Text style={styles.title}>Clínicas</Text>
          </View>
          <Text style={styles.subtitle}>
            Encontre a clínica ideal para você
          </Text>
        </View>
        
        <View style={styles.searchContainer}>
          <ModernInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar por nome ou endereço..."
            icon="search-outline"
            style={styles.searchInput}
          />
        </View>
      </LinearGradient>

      <SpecializationFilters />

      {loading && !clinics.length ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando clínicas...</Text>
            <Text style={styles.loadingSubtext}>Aguarde um momento</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredClinics}
          renderItem={renderClinicItem}
          keyExtractor={(item) => item.codigo.toString()}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerContent: {
    marginBottom: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    marginLeft: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
  },
  searchContainer: {
    marginTop: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 0,
    ...shadows.medium,
  },
  filtersSection: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterHeaderText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  clearFilterButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  clearFilterText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.small,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterIcon: {
    marginRight: spacing.xs,
  },
  filterText: {
    color: colors.primary,
    fontWeight: fontWeight.medium,
    fontSize: fontSize.sm,
  },
  filterTextActive: {
    color: colors.onPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingContent: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  loadingSubtext: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  listContentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.small,
  },
  refreshButtonText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.medium,
    marginLeft: spacing.sm,
  },
});
