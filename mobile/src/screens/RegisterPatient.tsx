// src/screens/RegisterPatient.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { RootStackParamList } from "../navigation";
import { authRegister } from "../api/client";
import ModernInput from "../components/ModernInput";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";

type Props = {
  navigation: any;
};

export default function RegisterPatient({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [datan, setDatan] = useState("");
  const [fone, setFone] = useState("");
  const [ende, setEnde] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleRegister() {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Nome, email e senha são obrigatórios");
      return;
    }

    try {
      const payload = { nome, datan, fone, ende, email, senha };
      await authRegister("paciente", payload);
      Alert.alert("Sucesso", "Paciente cadastrado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.error || "Não foi possível cadastrar o paciente.";
      Alert.alert("Erro", errorMessage);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Cadastrar Paciente</Text>
        <Text style={styles.subtitle}>Preencha seus dados pessoais</Text>
      </View>

      {/* Main Form Card */}
      <ModernCard variant="elevated" style={styles.formCard}>
        <View style={styles.form}>
          <ModernInput
            label="Nome Completo *"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome completo"
          />

          <ModernInput
            label="Data de Nascimento"
            value={datan}
            onChangeText={setDatan}
            placeholder="YYYY-MM-DD (ex: 1990-01-15)"
            helperText="Formato: Ano-Mês-Dia"
          />

          <ModernInput
            label="Telefone"
            value={fone}
            onChangeText={setFone}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
          />

          <ModernInput
            label="Endereço"
            value={ende}
            onChangeText={setEnde}
            placeholder="Rua, número, bairro, cidade"
            multiline
            numberOfLines={3}
          />

          <ModernInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
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
        </View>
      </ModernCard>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <ModernButton
          title="Cadastrar Paciente"
          onPress={handleRegister}
          size="large"
          fullWidth
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
  actionButtons: {
    gap: spacing.md,
  },
});
