import { supabase } from '../supabaseClient';

export interface ClinicData {
  nome: string;
  endereco?: string;
  fone?: string;
  email: string;
  senha?: string;
  imagem?: string;
}

export interface UpdateClinicData {
  nome?: string;
  endereco?: string;
  fone?: string;
  email?: string;
  senha?: string;
  imagem?: string;
}

export class ClinicService {
  async getAllClinics() {
    const { data, error } = await supabase
      .from('clinicas')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getClinicById(codigo: number) {
    if (Number.isNaN(codigo)) {
      throw new Error('Código inválido');
    }

    const { data, error } = await supabase
      .from('clinicas')
      .select('*')
      .eq('codigo', codigo)
      .limit(1)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createClinic(clinicData: ClinicData) {
    const { nome, endereco, fone, email, senha, imagem } = clinicData;

    if (!nome || !email || !senha) {
      throw new Error('Dados incompletos: nome, email e senha são obrigatórios');
    }

    const payload = { nome, endereco, fone, email, senha, imagem };

    const { data, error } = await supabase
      .from('clinicas')
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async updateClinic(codigo: number, updateData: UpdateClinicData) {
    if (Number.isNaN(codigo)) {
      throw new Error('Código inválido');
    }

    const { nome, endereco, fone, email, senha, imagem } = updateData;
    const update: any = {};

    if (nome !== undefined) update.nome = nome;
    if (endereco !== undefined) update.endereco = endereco;
    if (fone !== undefined) update.fone = fone;
    if (email !== undefined) update.email = email;
    if (senha !== undefined) update.senha = senha;
    if (imagem !== undefined) update.imagem = imagem;

    const { data, error } = await supabase
      .from('clinicas')
      .update(update)
      .eq('codigo', codigo)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteClinic(codigo: number) {
    if (Number.isNaN(codigo)) {
      throw new Error('Código inválido');
    }

    const { error } = await supabase
      .from('clinicas')
      .delete()
      .eq('codigo', codigo);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }
}

export const clinicService = new ClinicService();