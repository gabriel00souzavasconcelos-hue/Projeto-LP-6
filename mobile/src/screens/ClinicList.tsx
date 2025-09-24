import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl, TouchableOpacity, Image } from "react-native";
import ModernCard from "../components/ModernCard";
import ModernInput from "../components/ModernInput";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";
import { getClinics } from "../api/client";
import { Clinic } from "../types";
import { useSpecializations } from "../hooks/useSpecializations";

type Props = {
  navigation: any;
};

const ModernClinicCard = ({ clinic, onPress }: { clinic: Clinic; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress}>
    <ModernCard style={styles.clinicCard}>
      <View style={styles.clinicCardContent}>
        <View style={styles.clinicImageContainer}>
          <Image 
            source={clinic.imagem ? { uri: clinic.imagem } : require('../../assets/clinic-placeholder.jpg')}
            style={styles.clinicImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.clinicInfo}>
          <Text style={styles.clinicName}>{clinic.nome}</Text>
          <Text style={styles.clinicAddress}>📍 {clinic.endereco || 'Endereço não informado'}</Text>
          <Text style={styles.clinicPhone}>📞 {clinic.fone || 'Telefone não informado'}</Text>
          <Text style={styles.clinicEmail}>✉️ {clinic.email || 'Email não informado'}</Text>
          {clinic.especializacoes && clinic.especializacoes.length > 0 && (
            <View style={styles.specializationsContainer}>
              {clinic.especializacoes.slice(0, 3).map((spec, index) => (
                <View key={index} style={styles.specializationTag}>
                  <Text style={styles.specializationText}>{spec}</Text>
                </View>
              ))}
              {clinic.especializacoes.length > 3 && (
                <View style={styles.specializationTag}>
                  <Text style={styles.specializationText}>+{clinic.especializacoes.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ModernCard>
  </TouchableOpacity>
);

export default function ClinicList({ navigation }: Props) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const { specializations } = useSpecializations();

  useEffect(() => {
    fetchClinics();
  }, []);

  useEffect(() => {
    filterClinics();
  }, [searchTerm, selectedSpecialization, clinics]);

  const fetchClinics = async (specialization?: string) => {
    try {
      setLoading(true);
      const data = await getClinics(specialization);
      setClinics(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar clínicas.");
    } finally {
      setLoading(false);
    }
  };

  const filterClinics = () => {
    let filtered = clinics;

    if (searchTerm) {
      filtered = filtered.filter(clinic =>
        clinic.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.endereco?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClinics(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setSelectedSpecialization(""); // Clear specialization filter when searching
  };

  const handleSpecializationFilter = (specializationName: string) => {
    if (selectedSpecialization === specializationName) {
      // Remove filter
      setSelectedSpecialization("");
      setSearchTerm(""); // Clear search when removing filter
      fetchClinics();
    } else {
      // Apply filter
      setSelectedSpecialization(specializationName);
      setSearchTerm(""); // Clear search when applying filter
      fetchClinics(specializationName);
    }
  };

  const renderClinicItem = ({ item }: { item: Clinic }) => (
    <ModernClinicCard 
      clinic={item} 
      onPress={() => navigation.navigate("ClinicDetails", { clinicId: item.codigo })} 
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Nenhuma clínica encontrada</Text>
      <Text style={styles.emptyStateText}>
        Tente ajustar sua busca ou filtros
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Clínicas Disponíveis</Text>
        <Text style={styles.subtitle}>Encontre a clínica ideal para você</Text>
      </View>

      {/* Search and Filters */}
      <ModernCard style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <ModernInput
            label="Buscar clínicas"
            value={searchTerm}
            onChangeText={handleSearch}
            placeholder="Digite o nome da clínica ou endereço"
          />
          
          {/* Specialization Filters */}
          <View style={styles.filtersSection}>
            <Text style={styles.filtersTitle}>🏥 Filtrar por Especialização:</Text>
            <View style={styles.specializationFilters}>
              <TouchableOpacity
                style={[
                  styles.specializationFilter,
                  !selectedSpecialization && styles.selectedFilter
                ]}
                onPress={() => handleSpecializationFilter("")}
              >
                <Text style={[
                  styles.filterText,
                  !selectedSpecialization && styles.selectedFilterText
                ]}>
                  Todas
                </Text>
              </TouchableOpacity>
              
              {specializations.map((spec) => (
                <TouchableOpacity
                  key={spec.codigo || spec.nome}
                  style={[
                    styles.specializationFilter,
                    selectedSpecialization === spec.nome && styles.selectedFilter
                  ]}
                  onPress={() => handleSpecializationFilter(spec.nome)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedSpecialization === spec.nome && styles.selectedFilterText
                  ]}>
                    {spec.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {selectedSpecialization && (
              <Text style={styles.filterStatus}>
                📍 Mostrando clínicas com "{selectedSpecialization}"
              </Text>
            )}
          </View>
        </View>
      </ModernCard>

      {/* Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsCount}>
          {filteredClinics.length} clínica{filteredClinics.length !== 1 ? 's' : ''} encontrada{filteredClinics.length !== 1 ? 's' : ''}
        </Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando clínicas...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredClinics}
            renderItem={renderClinicItem}
            keyExtractor={(item) => item.codigo.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.clinicsList}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchClinics}
                colors={[colors.primary]}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  searchCard: {
    marginBottom: spacing.md,
  },
  searchContainer: {
    gap: spacing.md,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  clinicsList: {
    flex: 1,
  },
  clinicCard: {
    marginBottom: spacing.md,
  },
  clinicCardContent: {
    flexDirection: 'row',
  },
  clinicImageContainer: {
    marginRight: spacing.md,
  },
  clinicImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  clinicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  clinicName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  clinicAddress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  clinicPhone: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  clinicEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  specializationTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  specializationText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  filtersSection: {
    marginTop: spacing.md,
  },
  filtersTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  specializationFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  specializationFilter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  selectedFilterText: {
    color: colors.onPrimary,
  },
  filterStatus: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});