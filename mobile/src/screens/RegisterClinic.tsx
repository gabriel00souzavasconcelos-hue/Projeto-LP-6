import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ModernInput from "../components/ModernInput";
import ModernButton from "../components/ModernButton";
import CircularImage from "../components/CircularImage";
import { useImagePicker } from "../hooks/useImagePicker";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../styles/theme";
import { authRegister, uploadImage } from "../api/client";

type Props = {
  navigation: any;
};

export default function RegisterClinic({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [fone, setFone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const { image, showImageOptions, setUploading } = useImagePicker();

  async function handleRegister() {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Nome, email e senha são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (image.uri) {
        setUploading(true);
        try {
          imageUrl = await uploadImage(image.uri);
        } catch (uploadError) {
          console.warn("Image upload failed, proceeding without it.", uploadError);
        } finally {
          setUploading(false);
        }
      }

      const payload = { nome, endereco, fone, email, senha, imagem: imageUrl || null };
      await authRegister("clinica", payload);
      Alert.alert("Sucesso!", "Clínica cadastrada com sucesso.", [
        { text: "Ir para Login", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error || "Não foi possível cadastrar a clínica.";
      Alert.alert("Erro no Cadastro", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Cadastre sua Clínica</Text>
            <Text style={styles.subtitle}>
              Preencha os dados para começar
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.imageContainer}>
              <CircularImage
                uri={image.uri}
                size={100}
                onPress={showImageOptions}
                showEditButton={true}
                loading={image.isUploading}
              />
            </View>

            <ModernInput
              label="Nome da Clínica *"
              value={nome}
              onChangeText={setNome}
              placeholder="Digite o nome da clínica"
              icon="business-outline"
            />

            <ModernInput
              label="Endereço"
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Sua rua, número, bairro..."
              icon="location-outline"
            />

            <ModernInput
              label="Telefone"
              value={fone}
              onChangeText={setFone}
              placeholder="(XX) XXXXX-XXXX"
              keyboardType="phone-pad"
              icon="call-outline"
            />

            <ModernInput
              label="Email *"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />

            <ModernInput
              label="Senha *"
              value={senha}
              onChangeText={setSenha}
              placeholder="Crie uma senha segura"
              secureTextEntry
              icon="lock-closed-outline"
            />

            <ModernButton
              title={loading ? "Cadastrando..." : "Finalizar Cadastro"}
              onPress={handleRegister}
              variant="primary"
              size="large"
              fullWidth
              disabled={loading}
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}>Faça Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: "80%",
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.medium,
    marginLeft: spacing.xs,
  },
});