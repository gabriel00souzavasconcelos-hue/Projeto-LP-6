// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../navigation";
import { authLogin } from "../api/client";
import ModernInput from "../components/ModernInput";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<"paciente" | "clinica">("paciente");

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const resp = await authLogin(email, senha, role);
      if (!resp?.user) {
        Alert.alert("Erro", "Credenciais inválidas");
        return;
      }
      
      if (role === "paciente") {
        navigation.replace("PatientMenu", { patient: resp.user });
      } else {
        navigation.replace("ClinicMenu", { clinic: resp.user });
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.error || "Falha no login. Verifique suas credenciais.";
      Alert.alert("Erro", errorMessage);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Faça login em sua conta</Text>
      </View>

      {/* Main Card */}
      <ModernCard variant="elevated" style={styles.loginCard}>
        {/* Role Selection */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Tipo de Conta</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "paciente" && styles.roleButtonActive
              ]}
              onPress={() => setRole("paciente")}
            >
              <Text style={[
                styles.roleButtonText,
                role === "paciente" && styles.roleButtonTextActive
              ]}>
                👤 Paciente
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "clinica" && styles.roleButtonActive
              ]}
              onPress={() => setRole("clinica")}
            >
              <Text style={[
                styles.roleButtonText,
                role === "clinica" && styles.roleButtonTextActive
              ]}>
                🏥 Clínica
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <ModernInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ModernInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            secureTextEntry
          />

          <ModernButton
            title="Entrar"
            onPress={handleLogin}
            size="large"
            fullWidth
            style={styles.loginButton}
          />
        </View>
      </ModernCard>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <ModernButton
          title="Cadastrar Paciente"
          onPress={() => navigation.navigate("RegisterPatient")}
          variant="outline"
          size="medium"
          fullWidth
          style={styles.actionButton}
        />
        
        <ModernButton
          title="Cadastrar Clínica"
          onPress={() => navigation.navigate("RegisterClinic")}
          variant="outline"
          size="medium"
          fullWidth
          style={styles.actionButton}
        />
        
        <ModernButton
          title="Ver Clínicas Disponíveis"
          onPress={() => navigation.navigate("ClinicList")}
          variant="ghost"
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
    marginTop: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loginCard: {
    marginBottom: spacing.lg,
  },
  roleContainer: {
    marginBottom: spacing.lg,
  },
  roleLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
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
  form: {
    gap: spacing.sm,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  actionButtons: {
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});
