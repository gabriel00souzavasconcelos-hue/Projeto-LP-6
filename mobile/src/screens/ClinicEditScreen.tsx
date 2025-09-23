import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { RootStackParamList } from "../navigation";
import { updateClinic } from "../api/client";
import { Clinic } from "../types";
import ModernInput from "../components/ModernInput";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";

type Props = {
  navigation: any;
  route: any;
};

export default function ClinicEditScreen({ route, navigation }: Props) {
  const clinic: Clinic = route.params?.clinic;
  const [nome, setNome] = useState(clinic?.nome ?? "");
  const [endereco, setEndereco] = useState(clinic?.endereco ?? "");
  const [fone, setFone] = useState(clinic?.fone ?? "");
  const [email, setEmail] = useState(clinic?.email ?? "");
  const [imagem, setImagem] = useState(clinic?.imagem ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!nome || !email) {
      Alert.alert("Erro", "Nome e email são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      await updateClinic(clinic.codigo, { nome, endereco, fone, email, imagem });
      Alert.alert("Sucesso", "Dados atualizados com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.error || "Não foi possível atualizar os dados.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Editar Clínica</Text>
        <Text style={styles.subtitle}>Atualize as informações da sua clínica</Text>
      </View>

      
      {imagem && (
        <ModernCard variant="outlined" style={styles.imagePreviewCard}>
          <Text style={styles.previewLabel}>Imagem Atual</Text>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imagem }} style={styles.previewImage} />
          </View>
        </ModernCard>
      )}

      
      <ModernCard variant="elevated" style={styles.formCard}>
        <View style={styles.form}>
          <ModernInput
            label="Nome da Clínica *"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome da clínica"
          />

          <ModernInput
            label="Endereço"
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Endereço completo da clínica"
            multiline
            numberOfLines={3}
          />

          <ModernInput
            label="Telefone"
            value={fone}
            onChangeText={setFone}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
          />

          <ModernInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="email@clinica.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ModernInput
            label="URL da Imagem"
            value={imagem}
            onChangeText={setImagem}
            placeholder="https://exemplo.com/logo.jpg"
            autoCapitalize="none"
            helperText="Cole aqui o link da imagem da sua clínica"
          />
        </View>
      </ModernCard>

      
      <View style={styles.actionButtons}>
        <ModernButton
          title={loading ? "Salvando..." : "Salvar Alterações"}
          onPress={handleSave}
          size="large"
          fullWidth
          disabled={loading}
        />
        
        <ModernButton
          title="Cancelar"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
          fullWidth
          disabled={loading}
        />
      </View>

    
      <ModernCard variant="outlined" style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 Dicas</Text>
        <Text style={styles.infoText}>
          • Mantenha suas informações sempre atualizadas{'\n'}
          • Uma boa foto ajuda pacientes a identificar sua clínica{'\n'}
          • Inclua todas as formas de contato disponíveis
        </Text>
      </ModernCard>
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  imagePreviewCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceVariant,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.sm,
  },
  actionButtons: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
