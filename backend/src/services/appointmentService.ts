import { supabase } from '../supabaseClient';
import { Appointment, AppointmentWithDetails } from '../types';

export async function createAppointment(appointmentData: Omit<Appointment, 'codigo' | 'criado_em' | 'atualizado_em'>) {
  const { data, error } = await supabase
    .from('consultas')
    .insert(appointmentData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAppointmentById(codigo: number): Promise<AppointmentWithDetails | null> {
  const { data, error } = await supabase
    .from('consultas')
    .select(`
      *,
      pacientes(nome, email),
      clinicas(nome, endereco),
      especializacoes(nome)
    `)
    .eq('codigo', codigo)
    .single();

  if (error) throw error;
  
  if (!data) return null;

  return {
    ...data,
    paciente_nome: data.pacientes?.nome,
    paciente_email: data.pacientes?.email,
    clinica_nome: data.clinicas?.nome,
    clinica_endereco: data.clinicas?.endereco,
    especializacao_nome: data.especializacoes?.nome,
  } as AppointmentWithDetails;
}

export async function getAppointmentsByPatient(codigo_paciente: number): Promise<AppointmentWithDetails[]> {
  const { data, error } = await supabase
    .from('consultas')
    .select(`
      *,
      clinicas(nome, endereco, fone),
      especializacoes(nome)
    `)
    .eq('codigo_paciente', codigo_paciente)
    .order('data_hora', { ascending: true });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    ...item,
    clinica_nome: item.clinicas?.nome,
    clinica_endereco: item.clinicas?.endereco,
    especializacao_nome: item.especializacoes?.nome,
  }));
}

export async function getAppointmentsByClinic(codigo_clinica: number): Promise<AppointmentWithDetails[]> {
  const { data, error } = await supabase
    .from('consultas')
    .select(`
      *,
      pacientes(nome, email, fone),
      especializacoes(nome)
    `)
    .eq('codigo_clinica', codigo_clinica)
    .order('data_hora', { ascending: true });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    ...item,
    paciente_nome: item.pacientes?.nome,
    paciente_email: item.pacientes?.email,
    especializacao_nome: item.especializacoes?.nome,
  }));
}

export async function updateAppointmentStatus(codigo: number, status: Appointment['status']) {
  const { data, error } = await supabase
    .from('consultas')
    .update({ status, atualizado_em: new Date().toISOString() })
    .eq('codigo', codigo)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAppointment(codigo: number, updates: Partial<Omit<Appointment, 'codigo' | 'criado_em' | 'atualizado_em'>>) {
  const { data, error } = await supabase
    .from('consultas')
    .update({ ...updates, atualizado_em: new Date().toISOString() })
    .eq('codigo', codigo)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAppointment(codigo: number) {
  const { error } = await supabase
    .from('consultas')
    .delete()
    .eq('codigo', codigo);

  if (error) throw error;
  return { message: 'Consulta excluída com sucesso' };
}

export async function getAvailableSlots(codigo_clinica: number, data: string) {
  // Busca todas as consultas da clínica para aquela data
  const { data: appointments, error } = await supabase
    .from('consultas')
    .select('data_hora')
    .eq('codigo_clinica', codigo_clinica)
    .gte('data_hora', `${data} 00:00:00`)
    .lte('data_hora', `${data} 23:59:59`)
    .neq('status', 'cancelada');

  if (error) throw error;

  // Gera horários disponíveis (08:00 - 18:00, de hora em hora)
  const allSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    allSlots.push(`${data} ${hour.toString().padStart(2, '0')}:00:00`);
  }

  // Remove horários já agendados
  const bookedSlots = (appointments || []).map((apt: any) => apt.data_hora);
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

  return availableSlots;
}
