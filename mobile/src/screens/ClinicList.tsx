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
} from "react-native";
import ClinicCard from "../components/ClinicCard";
import ModernInput from "../components/ModernInput";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../styles/theme";
import { getClinics } from "../api/client";
import { Clinic } from "../types";
import { useSpecializations } from "../hooks/useSpecializations";

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
      <Text style={styles.emptyStateTitle}>Nenhuma clínica encontrada</Text>
      <Text style={styles.emptyStateText}>
        Tente ajustar sua busca ou filtros, ou puxe para recarregar.
      </Text>
    </View>
  );

  const SpecializationFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
    >
      <TouchableOpacity
        style={[styles.filterChip, !activeFilter && styles.filterChipActive]}
        onPress={() => setActiveFilter(null)}
      >
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
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Encontre uma Clínica</Text>
        <View style={styles.searchContainer}>
          <ModernInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar por nome ou endereço..."
            icon="search-outline"
            style={{ backgroundColor: colors.surface, borderWidth: 0 }}
          />
        </View>
      </View>

      <SpecializationFilters />

      {loading && !clinics.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando clínicas...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredClinics}
          renderItem={renderClinicItem}
          keyExtractor={(item) => item.codigo.toString()}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContentContainer}
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
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  searchContainer: {
    marginTop: spacing.md,
  },
  filtersContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  filterChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  filterText: {
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  filterTextActive: {
    color: colors.onPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  listContentContainer: {
    padding: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  emptyStateTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
