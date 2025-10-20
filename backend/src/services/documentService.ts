import { supabase } from '../supabaseClient';
import { Document, DocumentWithDetails } from '../types';

export async function createDocument(documentData: Omit<Document, 'codigo' | 'criado_em'>) {
  const { data, error } = await supabase
    .from('documentos')
    .insert(documentData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDocumentById(codigo: number): Promise<DocumentWithDetails | null> {
  const { data, error } = await supabase
    .from('documentos')
    .select(`
      *,
      pacientes(nome),
      clinicas(nome)
    `)
    .eq('codigo', codigo)
    .single();

  if (error) throw error;
  
  if (!data) return null;

  return {
    ...data,
    paciente_nome: data.pacientes?.nome,
    clinica_nome: data.clinicas?.nome,
  } as DocumentWithDetails;
}

export async function getDocumentsByPatient(codigo_paciente: number): Promise<DocumentWithDetails[]> {
  const { data, error } = await supabase
    .from('documentos')
    .select(`
      *,
      clinicas(nome)
    `)
    .eq('codigo_paciente', codigo_paciente)
    .order('criado_em', { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    ...item,
    clinica_nome: item.clinicas?.nome,
  }));
}

export async function getDocumentsByClinic(codigo_clinica: number): Promise<DocumentWithDetails[]> {
  const { data, error } = await supabase
    .from('documentos')
    .select(`
      *,
      pacientes(nome, email)
    `)
    .eq('codigo_clinica', codigo_clinica)
    .order('criado_em', { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    ...item,
    paciente_nome: item.pacientes?.nome,
  }));
}

export async function getDocumentsByPatientAndClinic(codigo_paciente: number, codigo_clinica: number): Promise<DocumentWithDetails[]> {
  const { data, error } = await supabase
    .from('documentos')
    .select(`
      *,
      clinicas(nome)
    `)
    .eq('codigo_paciente', codigo_paciente)
    .or(`codigo_clinica.eq.${codigo_clinica},codigo_clinica.is.null`)
    .order('criado_em', { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    ...item,
    clinica_nome: item.clinicas?.nome,
  }));
}

export async function deleteDocument(codigo: number) {
  const { error } = await supabase
    .from('documentos')
    .delete()
    .eq('codigo', codigo);

  if (error) throw error;
  return { message: 'Documento excluído com sucesso' };
}

export async function updateDocument(codigo: number, updates: Partial<Omit<Document, 'codigo' | 'criado_em'>>) {
  const { data, error } = await supabase
    .from('documentos')
    .update(updates)
    .eq('codigo', codigo)
    .select()
    .single();

  if (error) throw error;
  return data;
}
