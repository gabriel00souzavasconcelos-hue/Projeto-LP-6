import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { RootStackParamList } from "../navigation";
import { authRegister } from "../api/client";
import ModernInput from "../components/ModernInput";
import ModernButton from "../components/ModernButton";
import ModernCard from "../components/ModernCard";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";
import { formatDateInput, convertDateToISO, validateDateFormat } from "../utils/dateUtils";

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

    // Validar formato da data se foi fornecida
    if (datan && datan.length > 0 && !validateDateFormat(datan)) {
      Alert.alert("Erro", "Formato de data inválido. Use DD/MM/YYYY");
      return;
    }

    try {
      // Converter data para formato ISO se foi fornecida
      const datanISO = datan && datan.length > 0 ? convertDateToISO(datan) : datan;
      const payload = { nome, datan: datanISO, fone, ende, email, senha };
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
      
      <View style={styles.header}>
        <Text style={styles.title}>Cadastrar Paciente</Text>
        <Text style={styles.subtitle}>Preencha seus dados pessoais</Text>
      </View>

      
      <ModernCard variant="elevated" style={styles.formCard}>
        <View style={styles.form}>
          <ModernInput
            label="Nome Completo *"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome completo"
          />

          <ModernInput
            label="Data de Nascimento (opcional)"
            value={datan}
            onChangeText={(text) => setDatan(formatDateInput(text))}
            placeholder="DD/MM/YYYY (ex: 15/01/1990)"
            helperText="Formato: Dia/Mês/Ano"
            keyboardType="numeric"
            maxLength={10}
          />

          <ModernInput
            label="Telefone (opcional)"
            value={fone}
            onChangeText={setFone}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
          />

          <ModernInput
            label="Endereço (opcional)"
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
