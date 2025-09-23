import { supabase } from '../supabaseClient';

export interface SpecializationData {
  nome: string;
}

export class SpecializationService {
  async getAllSpecializations() {
    const { data, error } = await supabase
      .from('especializacoes')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createSpecialization(specializationData: SpecializationData) {
    const { nome } = specializationData;

    if (!nome) {
      throw new Error('Nome obrigatório');
    }

    const payload = { nome };

    const { data, error } = await supabase
      .from('especializacoes')
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteSpecialization(codigo: number) {
    if (Number.isNaN(codigo)) {
      throw new Error('Código inválido');
    }

    const { error } = await supabase
      .from('especializacoes')
      .delete()
      .eq('codigo', codigo);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }
}

export const specializationService = new SpecializationService();