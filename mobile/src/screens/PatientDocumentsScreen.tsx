import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, RefreshControl, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme";
import ModernCard from "../components/ModernCard";
import ModernButton from "../components/ModernButton";
import { getDocumentsByPatient, uploadDocument, deleteDocument } from "../api/client";
import { DocumentWithDetails, DocumentType } from "../types";

type Props = {
  navigation: any;
  route: any;
};

export default function PatientDocumentsScreen({ route }: Props) {
  const patient = route.params?.patient;
  const [documents, setDocuments] = useState<DocumentWithDetails[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<DocumentType | 'all'>('all');

  useEffect(() => {
    if (patient?.codigo) {
      loadDocuments();
    }
  }, [patient?.codigo]);

  const loadDocuments = async () => {
    try {
      const data = await getDocumentsByPatient(patient.codigo);
      setDocuments(data);
    } catch (error: any) {
      console.error("Erro ao carregar documentos:", error);
      Alert.alert("Erro", "Não foi possível carregar os documentos");
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const pickDocument = async (tipo: DocumentType) => {
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
              await handleUpload(file.uri, tipo, descricao || '');
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

  const handleUpload = async (fileUri: string, tipo: DocumentType, descricao: string) => {
    try {
      setUploading(true);
      
      await uploadDocument(fileUri, {
        codigo_paciente: patient.codigo,
        tipo_documento: tipo,
        descricao: descricao || undefined,
        enviado_por: 'paciente',
      });

      Alert.alert("Sucesso", "Documento enviado com sucesso!");
      loadDocuments();
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
              loadDocuments();
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

  const filteredDocuments = filter === 'all' 
    ? documents 
    : documents.filter(doc => doc.tipo_documento === filter);

  const documentTypes: { type: DocumentType; icon: any; label: string }[] = [
    { type: 'exame', icon: 'flask', label: 'Exame' },
    { type: 'receita', icon: 'receipt', label: 'Receita' },
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

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todos ({documents.length})
          </Text>
        </TouchableOpacity>
        {documentTypes.map((docType) => {
          const count = documents.filter(doc => doc.tipo_documento === docType.type).length;
          return (
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
                {docType.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de Documentos */}
      <ScrollView
        style={styles.documentsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredDocuments.length === 0 ? (
          <ModernCard variant="outlined" style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhum documento</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'all' 
                ? 'Comece enviando seus documentos médicos'
                : `Nenhum documento do tipo "${getDocumentLabel(filter as DocumentType)}"`
              }
            </Text>
          </ModernCard>
        ) : (
          filteredDocuments.map((doc) => (
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
                {doc.enviado_por === 'clinica' && (
                  <View style={styles.clinicBadge}>
                    <Ionicons name="business" size={12} color={colors.success} />
                    <Text style={styles.clinicBadgeText}>Clínica</Text>
                  </View>
                )}
              </View>

              {doc.descricao && (
                <Text style={styles.documentDescription}>{doc.descricao}</Text>
              )}

              {doc.clinica_nome && (
                <Text style={styles.documentClinic}>📍 {doc.clinica_nome}</Text>
              )}

              <View style={styles.documentActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openDocument(doc.url_arquivo)}
                >
                  <Ionicons name="eye" size={18} color={colors.primary} />
                  <Text style={styles.actionButtonText}>Visualizar</Text>
                </TouchableOpacity>
                
                {doc.enviado_por === 'paciente' && (
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
          ))
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
  clinicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success + '20',
  },
  clinicBadgeText: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: fontWeight.medium as any,
  },
  documentDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  documentClinic: {
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
