import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, RefreshControl, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";
import ModernCard from "../components/ModernCard";
import ModernButton from "../components/ModernButton";
import { getDocumentsByClinic, uploadDocument, deleteDocument, getClinicPatients } from "../api/client";
import { DocumentWithDetails, DocumentType, Patient } from "../types";

type Props = {
  navigation: any;
  route: any;
};

export default function ClinicDocumentsScreen({ route }: Props) {
  const clinic = route.params?.clinic;
  const [documents, setDocuments] = useState<DocumentWithDetails[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<DocumentType | 'all'>('all');

  useEffect(() => {
    if (clinic?.codigo) {
      loadData();
    }
  }, [clinic?.codigo]);

  const loadData = async () => {
    try {
      const [docsData, patientsData] = await Promise.all([
        getDocumentsByClinic(clinic.codigo),
        getClinicPatients(clinic.codigo),
      ]);
      setDocuments(docsData);
      setPatients(patientsData);
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados");
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const pickDocument = async (tipo: DocumentType) => {
    if (patients.length === 0) {
      Alert.alert("Atenção", "Nenhum paciente cadastrado");
      return;
    }

    // Selecionar paciente
    Alert.alert(
      "Selecione o Paciente",
      "Para qual paciente é este documento?",
      [
        { text: "Cancelar", style: "cancel" },
        ...patients.map(p => ({
          text: p.nome,
          onPress: () => selectDocumentAndUpload(p.codigo!, tipo),
        })),
      ]
    );
  };

  const selectDocumentAndUpload = async (patientId: number, tipo: DocumentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      Alert.prompt(
        "Descrição do Documento",
        "Adicione uma descrição (opcional)",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Enviar",
            onPress: async (descricao) => {
              await handleUpload(file.uri, patientId, tipo, descricao || '');
            }
          }
        ],
        "plain-text"
      );
    } catch (error) {
      console.error("Erro ao selecionar documento:", error);
      Alert.alert("Erro", "Não foi possível selecionar o documento");
    }
  };

  const handleUpload = async (fileUri: string, patientId: number, tipo: DocumentType, descricao: string) => {
    try {
      setUploading(true);
      
      await uploadDocument(fileUri, {
        codigo_paciente: patientId,
        codigo_clinica: clinic.codigo,
        tipo_documento: tipo,
        descricao: descricao || undefined,
        enviado_por: 'clinica',
      });

      Alert.alert("Sucesso", "Documento enviado com sucesso!");
      loadData();
    } catch (error: any) {
      console.error("Erro ao enviar documento:", error);
      Alert.alert("Erro", "Não foi possível enviar o documento");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (codigo: number) => {
    Alert.alert(
      "Excluir Documento",
      "Tem certeza que deseja excluir este documento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDocument(codigo);
              Alert.alert("Sucesso", "Documento excluído");
              loadData();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o documento");
            }
          }
        }
      ]
    );
  };

  const openDocument = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o documento");
    });
  };

  const getDocumentIcon = (tipo: DocumentType) => {
    switch (tipo) {
      case 'exame': return 'flask';
      case 'receita': return 'receipt';
      case 'laudo': return 'document-text';
      case 'atestado': return 'document';
      case 'pedido_exame': return 'clipboard';
      case 'resultado_exame': return 'checkmark-done';
      default: return 'document-attach';
    }
  };

  const getDocumentLabel = (tipo: DocumentType) => {
    const labels: Record<DocumentType, string> = {
      exame: 'Exame',
      receita: 'Receita',
      laudo: 'Laudo',
      atestado: 'Atestado',
      pedido_exame: 'Pedido de Exame',
      resultado_exame: 'Resultado de Exame',
      outro: 'Outro',
    };
    return labels[tipo];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = filter === 'all' || doc.tipo_documento === filter;
    const matchesPatient = selectedPatient === 'all' || doc.codigo_paciente === selectedPatient;
    return matchesType && matchesPatient;
  });

  // Agrupar documentos por paciente
  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    const patientId = doc.codigo_paciente;
    if (!acc[patientId]) {
      acc[patientId] = [];
    }
    acc[patientId].push(doc);
    return acc;
  }, {} as Record<number, DocumentWithDetails[]>);

  const documentTypes: { type: DocumentType; icon: any; label: string }[] = [
    { type: 'receita', icon: 'receipt', label: 'Receita' },
    { type: 'pedido_exame', icon: 'clipboard', label: 'Pedido' },
    { type: 'laudo', icon: 'document-text', label: 'Laudo' },
    { type: 'resultado_exame', icon: 'checkmark-done', label: 'Resultado' },
  ];

  return (
    <View style={styles.container}>
      {/* Botões de Upload */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.uploadButtonsContainer}>
        {documentTypes.map((docType) => (
          <TouchableOpacity
            key={docType.type}
            style={styles.uploadButton}
            onPress={() => pickDocument(docType.type)}
            disabled={uploading}
          >
            <View style={styles.uploadIconContainer}>
              <Ionicons name={docType.icon} size={24} color={colors.primary} />
            </View>
            <Text style={styles.uploadButtonText}>{docType.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtro de Pacientes */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, selectedPatient === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedPatient('all')}
        >
          <Text style={[styles.filterText, selectedPatient === 'all' && styles.filterTextActive]}>
            Todos os Pacientes ({documents.length})
          </Text>
        </TouchableOpacity>
        {patients.map((patient) => {
          const count = documents.filter(doc => doc.codigo_paciente === patient.codigo).length;
          if (count === 0) return null;
          return (
            <TouchableOpacity
              key={patient.codigo}
              style={[styles.filterChip, selectedPatient === patient.codigo && styles.filterChipActive]}
              onPress={() => setSelectedPatient(patient.codigo!)}
            >
              <Text style={[styles.filterText, selectedPatient === patient.codigo && styles.filterTextActive]}>
                {patient.nome} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filtro de Tipo */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterContainer, { paddingTop: 0 }]}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todos os Tipos
          </Text>
        </TouchableOpacity>
        {documentTypes.map((docType) => (
          <TouchableOpacity
            key={docType.type}
            style={[styles.filterChip, filter === docType.type && styles.filterChipActive]}
            onPress={() => setFilter(docType.type)}
          >
            <Ionicons
              name={docType.icon}
              size={14}
              color={filter === docType.type ? colors.surface : colors.primary}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.filterText, filter === docType.type && styles.filterTextActive]}>
              {docType.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de Documentos */}
      <ScrollView
        style={styles.documentsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {Object.keys(groupedDocuments).length === 0 ? (
          <ModernCard variant="outlined" style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhum documento</Text>
            <Text style={styles.emptySubtext}>
              Envie documentos para seus pacientes
            </Text>
          </ModernCard>
        ) : (
          Object.entries(groupedDocuments).map(([patientId, docs]) => {
            const patient = patients.find(p => p.codigo === Number(patientId));
            return (
              <View key={patientId} style={styles.patientSection}>
                <View style={styles.patientHeader}>
                  <Ionicons name="person-circle" size={24} color={colors.primary} />
                  <Text style={styles.patientName}>{patient?.nome || 'Paciente'}</Text>
                  <Text style={styles.documentCount}>({docs.length})</Text>
                </View>

                {docs.map((doc) => (
                  <ModernCard key={doc.codigo} variant="elevated" style={styles.documentCard}>
                    <View style={styles.documentHeader}>
                      <View style={[styles.documentIcon, { backgroundColor: colors.primary + '20' }]}>
                        <Ionicons name={getDocumentIcon(doc.tipo_documento)} size={24} color={colors.primary} />
                      </View>
                      <View style={styles.documentInfo}>
                        <Text style={styles.documentType}>{getDocumentLabel(doc.tipo_documento)}</Text>
                        <Text style={styles.documentDate}>
                          {new Date(doc.criado_em || '').toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                      {doc.enviado_por === 'paciente' && (
                        <View style={styles.patientBadge}>
                          <Ionicons name="person" size={12} color={colors.info} />
                          <Text style={styles.patientBadgeText}>Paciente</Text>
                        </View>
                      )}
                    </View>

                    {doc.descricao && (
                      <Text style={styles.documentDescription}>{doc.descricao}</Text>
                    )}

                    <View style={styles.documentActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openDocument(doc.url_arquivo)}
                      >
                        <Ionicons name="eye" size={18} color={colors.primary} />
                        <Text style={styles.actionButtonText}>Visualizar</Text>
                      </TouchableOpacity>
                      
                      {doc.enviado_por === 'clinica' && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDelete(doc.codigo!)}
                        >
                          <Ionicons name="trash" size={18} color={colors.error} />
                          <Text style={[styles.actionButtonText, { color: colors.error }]}>Excluir</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </ModernCard>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>

      {uploading && (
        <View style={styles.uploadingOverlay}>
          <ModernCard variant="elevated" style={styles.uploadingCard}>
            <Text style={styles.uploadingText}>Enviando documento...</Text>
          </ModernCard>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  uploadButtonsContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  uploadButton: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 80,
  },
  uploadIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  uploadButtonText: {
    fontSize: fontSize.xs,
    color: colors.text,
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium as any,
  },
  filterTextActive: {
    color: colors.surface,
  },
  documentsList: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: 0,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium as any,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  patientSection: {
    marginBottom: spacing.xl,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  patientName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  documentCount: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  documentCard: {
    marginBottom: spacing.md,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  documentInfo: {
    flex: 1,
  },
  documentType: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
  },
  documentDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  patientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.info + '20',
  },
  patientBadgeText: {
    fontSize: fontSize.xs,
    color: colors.info,
    fontWeight: fontWeight.medium as any,
  },
  documentDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  documentActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium as any,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingCard: {
    padding: spacing.xl,
  },
  uploadingText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
});
