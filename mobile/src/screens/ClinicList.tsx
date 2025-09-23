import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from "react-native";
import ClinicCard from "../components/ClinicCard";
import ModernInput from "../components/ModernInput";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import { getClinics, getSpecializations } from "../api/client";
import { Clinic, Specialization } from "../types";
import { RootStackParamList } from "../navigation";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";

type Props = {
  navigation: any;
};

export default function ClinicList({ navigation }: Props) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  async function loadSpecializations() {
    try {
      const s = await getSpecializations();
      setSpecializations(s);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadClinics(filter?: string) {
    try {
      setLoading(true);
      const list = await getClinics(filter);
      setClinics(list);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar clínicas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadClinics(specialization);
  }

  function handleSearch() {
    loadClinics(specialization);
  }

  function handleClearFilter() {
    setSpecialization("");
    loadClinics();
  }

  useEffect(() => {
    loadSpecializations();
    loadClinics();
  }, []);

  const renderClinicItem = ({ item }: { item: Clinic }) => (
    <ModernClinicCard 
      clinic={item} 
      onPress={() => navigation.navigate("ClinicMenu", { clinic: item })} 
    />
  );

  const renderEmptyState = () => (
    <ModernCard style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Nenhuma clínica encontrada</Text>
      <Text style={styles.emptyStateText}>
        {specialization 
          ? "Tente ajustar o filtro de especialização"
          : "Não há clínicas cadastradas no momento"
        }
      </Text>
      {specialization && (
        <ModernButton
          title="Limpar filtros"
          onPress={handleClearFilter}
          variant="outline"
          size="small"
        />
      )}
    </ModernCard>
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Clínicas Disponíveis</Text>
        <Text style={styles.subtitle}>Encontre a clínica ideal para você</Text>
      </View>

      
      <ModernCard variant="elevated" style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <ModernInput
            label="Buscar por especialização"
            value={specialization}
            onChangeText={setSpecialization}
            placeholder="ex: pediatria, cardiologia..."
            helperText="Digite a especialização que procura"
          />
          
          <View style={styles.searchButtons}>
            <ModernButton
              title="Buscar"
              onPress={handleSearch}
              size="medium"
              style={styles.searchButton}
            />
            
            <ModernButton
              title="Limpar"
              onPress={handleClearFilter}
              variant="outline"
              size="medium"
              style={styles.clearButton}
            />
          </View>
        </View>
      </ModernCard>

      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsCount}>
          {loading ? "Carregando..." : `${clinics.length} clínica(s) encontrada(s)`}
        </Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando clínicas...</Text>
          </View>
        ) : (
          <FlatList
            data={clinics}
            keyExtractor={(item) => String(item.codigo)}
            renderItem={renderClinicItem}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        )}
      </View>
    </View>
  );
}


function ModernClinicCard({ clinic, onPress }: { clinic: Clinic; onPress: () => void }) {
  return (
    <ModernCard variant="elevated" style={styles.clinicCard}>
      <View style={styles.clinicCardContent}>
        <View style={styles.clinicInfo}>
          <Text style={styles.clinicName}>{clinic.nome}</Text>
          {clinic.endereco && (
            <Text style={styles.clinicAddress}>{clinic.endereco}</Text>
          )}
          {clinic.fone && (
            <Text style={styles.clinicPhone}>📞 {clinic.fone}</Text>
          )}
          {clinic.email && (
            <Text style={styles.clinicEmail}>✉️ {clinic.email}</Text>
          )}
        </View>
        
        <ModernButton
          title="Ver Detalhes"
          onPress={onPress}
          variant="primary"
          size="small"
        />
      </View>
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  searchCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchContainer: {
    gap: spacing.md,
  },
  searchButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchButton: {
    flex: 1,
  },
  clearButton: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  resultsCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
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
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  clinicCard: {
    marginBottom: spacing.md,
  },
  clinicCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clinicInfo: {
    flex: 1,
    marginRight: spacing.md,
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
    marginBottom: spacing.xs,
  },
  clinicEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
