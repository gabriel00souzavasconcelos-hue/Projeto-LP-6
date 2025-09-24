import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { RootStackParamList } from "../navigation";
import { updateClinic, uploadImage } from "../api/client";
import { Clinic } from "../types";
import ModernInput from "../components/ModernInput";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import CircularImage from "../components/CircularImage";
import { useImagePicker } from "../hooks/useImagePicker";
import { colors, spacing, fontSize, fontWeight } from "../styles/theme";

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

  const { image, showImageOptions, setUploading } = useImagePicker(clinic?.imagem);

  async function handleUpdate() {
    if (!nome || !email) {
      Alert.alert("Erro", "Nome e email são obrigatórios");
      return;
    }

    try {
      setLoading(true);

      // Upload da imagem se houver uma nova selecionada
      let imagemUrl = imagem;
      if (image.uri && image.uri !== clinic?.imagem && image.uri !== imagem) {
        try {
          setUploading(true);
          imagemUrl = await uploadImage(image.uri);
          setUploading(false);
        } catch (uploadError) {
          console.warn('Erro no upload da imagem:', uploadError);
          setUploading(false);
          // Continue sem atualizar a imagem se o upload falhar
          imagemUrl = clinic?.imagem || '';
        }
      }

      const updatedData = { 
        nome, 
        endereco, 
        fone, 
        email, 
        imagem: imagemUrl || null 
      };
      
      await updateClinic(clinic.codigo!, updatedData);
      Alert.alert("Sucesso", "Clínica atualizada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.error || "Não foi possível atualizar a clínica.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Editar Clínica</Text>
        <Text style={styles.subtitle}>Atualize os dados da sua clínica</Text>
      </View>

      
      <ModernCard variant="elevated" style={styles.formCard}>
        <View style={styles.form}>
          {/* Preview da Imagem */}
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Foto da Clínica</Text>
            <CircularImage 
              uri={image.uri}
              size={120}
              onPress={showImageOptions}
              showEditButton={true}
              loading={image.isUploading}
            />
            <Text style={styles.imageHelperText}>
              Toque para alterar a imagem
            </Text>
          </View>

          <ModernInput
            label="Nome da Clínica *"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome da clínica"
          />

          <ModernInput
            label="Endereço (opcional)"
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Endereço completo da clínica"
            multiline
            numberOfLines={3}
          />

          <ModernInput
            label="Telefone (opcional)"
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
            label="URL da Imagem (opcional)"
            value={imagem}
            onChangeText={setImagem}
            placeholder="https://exemplo.com/logo.jpg"
            autoCapitalize="none"
            helperText="URL alternativa para imagem da clínica"
          />
        </View>
      </ModernCard>

      
      <View style={styles.actionButtons}>
        <ModernButton
          title={loading ? "Salvando..." : "Salvar Alterações"}
          onPress={handleUpdate}
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
  formCard: {
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.sm,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  imageLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  imageHelperText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  actionButtons: {
    gap: spacing.md,
  },
});