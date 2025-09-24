import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { RootStackParamList } from "../navigation";
import { authRegister, uploadImage } from "../api/client";
import ModernInput from "../components/ModernInput";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import CircularImage from "../components/CircularImage";
import { useImagePicker } from "../hooks/useImagePicker";
import { colors, spacing, fontSize, fontWeight } from "../styles/theme";

type Props = {
  navigation: any;
};

export default function RegisterClinic({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [fone, setFone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [imagem, setImagem] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { image, showImageOptions, setUploading } = useImagePicker();

  async function handleRegister() {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Nome, email e senha são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      
      // Upload da imagem se houver uma selecionada
      let imagemUrl = imagem;
      if (image.uri && image.uri !== imagem) {
        try {
          setUploading(true);
          imagemUrl = await uploadImage(image.uri);
          setUploading(false);
        } catch (uploadError) {
          console.warn('Erro no upload da imagem:', uploadError);
          setUploading(false);
          // Continue sem a imagem se o upload falhar
          imagemUrl = '';
        }
      }

      const payload = { nome, endereco, fone, email, senha, imagem: imagemUrl || null };
      await authRegister("clinica", payload);
      Alert.alert("Sucesso", "Clínica cadastrada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.error || "Não foi possível cadastrar a clínica.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Cadastrar Clínica</Text>
        <Text style={styles.subtitle}>Preencha os dados da sua clínica</Text>
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
              Toque para selecionar uma imagem
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
            label="Senha *"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite uma senha segura"
            secureTextEntry
          />

          <ModernInput
            label="URL da Imagem (opcional)"
            value={imagem}
            onChangeText={setImagem}
            placeholder="https://exemplo.com/logo.jpg"
            autoCapitalize="none"
            helperText="Adicione uma imagem para representar sua clínica"
          />
        </View>
      </ModernCard>

      
      <View style={styles.actionButtons}>
        <ModernButton
          title={loading ? "Cadastrando..." : "Cadastrar Clínica"}
          onPress={handleRegister}
          size="large"
          fullWidth
          disabled={loading}
        />
        
        <ModernButton
          title="Voltar"
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