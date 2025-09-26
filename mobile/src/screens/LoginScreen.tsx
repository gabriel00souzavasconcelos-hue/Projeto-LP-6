import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ModernInput from "../components/ModernInput";
import ModernButton from "../components/ModernButton";
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../styles/theme";
import { authLogin } from "../api/client";

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<"paciente" | "clinica">("paciente");

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro de Validação", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const resp = await authLogin(email, senha, role);
      if (!resp?.user) {
        Alert.alert("Erro de Login", "Credenciais inválidas. Tente novamente.");
        return;
      }

      if (role === "paciente") {
        navigation.replace("PatientMenu", { patient: resp.user });
      } else {
        navigation.replace("ClinicMenu", { clinic: resp.user });
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      const errorMessage =
        err?.response?.data?.error ||
        "Não foi possível fazer o login. Verifique sua conexão e credenciais.";
      Alert.alert("Erro", errorMessage);
    }
  }

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.background, colors.background]}
      locations={[0, 0.4, 1]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={require("../../assets/clinic-placeholder.jpg")} // Placeholder for the logo
              style={styles.logo}
            />
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>
              Acesse sua conta para continuar
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "paciente" && styles.roleButtonActive,
                ]}
                onPress={() => setRole("paciente")}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role === "paciente" && styles.roleButtonTextActive,
                  ]}
                >
                  👤 Sou Paciente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "clinica" && styles.roleButtonActive,
                ]}
                onPress={() => setRole("clinica")}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role === "clinica" && styles.roleButtonTextActive,
                  ]}
                >
                  🏥 Sou Clínica
                </Text>
              </TouchableOpacity>
            </View>

            <ModernInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />

            <ModernInput
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              placeholder="Sua senha"
              secureTextEntry
              icon="lock-closed-outline"
            />

            <ModernButton
              title="Entrar"
              onPress={handleLogin}
              variant="primary"
              size="large"
              fullWidth
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterPatient")}
            >
              <Text style={styles.linkText}>Cadastre-se como Paciente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterClinic")}
            >
              <Text style={styles.linkText}>Cadastre-se como Clínica</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.guestActions}>
            <ModernButton
              title="Ver Clínicas Disponíveis"
              onPress={() => navigation.navigate("ClinicList")}
              variant="ghost"
              size="medium"
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  logo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.round,
    marginBottom: spacing.lg,
    borderColor: colors.surface,
    borderWidth: 3,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
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
  roleSelector: {
    flexDirection: "row",
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    padding: spacing.xs,
  },
  roleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  roleButtonActive: {
    backgroundColor: colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  roleButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  roleButtonTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  footer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  footerText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  linkText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.medium,
    paddingVertical: spacing.xs,
  },
  guestActions: {
    marginTop: "auto",
    paddingTop: spacing.lg,
  },
});