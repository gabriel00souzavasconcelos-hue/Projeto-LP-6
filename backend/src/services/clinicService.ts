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
  async getAllClinics(filters?: { specialization?: string }) {
    try {
      if (filters?.specialization) {
        // Query clinics with specific specialization
        const { data, error } = await supabase
          .from('clinicas')
          .select(`
            codigo,
            nome,
            endereco,
            fone,
            email,
            imagem,
            clinicas_especializacoes!inner(
              especializacao:especializacoes!inner(
                nome
              )
            )
          `)
          .eq('clinicas_especializacoes.especializacao.nome', filters.specialization);

        if (error) {
          throw new Error(error.message);
        }

        // Transform data to include specializations array
        const transformedData = data?.map(clinic => ({
          ...clinic,
          especializacoes: clinic.clinicas_especializacoes?.map((ce: any) => ce.especializacao?.nome).filter(Boolean) || []
        }));

        return transformedData || [];
      } else {
        // Query all clinics with their specializations
        const { data, error } = await supabase
          .from('clinicas')
          .select(`
            codigo,
            nome,
            endereco,
            fone,
            email,
            imagem,
            clinicas_especializacoes(
              especializacao:especializacoes(
                nome
              )
            )
          `);

        if (error) {
          throw new Error(error.message);
        }

        // Transform data to include specializations array
        const transformedData = data?.map(clinic => ({
          ...clinic,
          especializacoes: clinic.clinicas_especializacoes?.map((ce: any) => ce.especializacao?.nome).filter(Boolean) || []
        }));

        return transformedData || [];
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
      throw error;
    }
  }

  async getClinicById(codigo: number) {
    if (Number.isNaN(codigo)) {
      throw new Error('Código inválido');
    }

    try {
      const { data, error } = await supabase
        .from('clinicas')
        .select(`
          codigo,
          nome,
          endereco,
          fone,
          email,
          imagem,
          clinicas_especializacoes(
            especializacao:especializacoes(
              nome
            )
          )
        `)
        .eq('codigo', codigo)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Clinic not found');
      }

      // Transform data to include specializations array
      const transformedData = {
        ...data,
        especializacoes: data.clinicas_especializacoes?.map((ce: any) => ce.especializacao?.nome).filter(Boolean) || []
      };

      return transformedData;
    } catch (error) {
      console.error('Error fetching clinic by id:', error);
      throw error;
    }
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

  async getClinicSpecializations(clinicId: number) {
    try {
      const { data, error } = await supabase
        .from('clinicas_especializacoes')
        .select(`
          codigo_especializacao,
          especializacoes!inner (
            codigo,
            nome
          )
        `)
        .eq('codigo_clinica', clinicId);

      if (error) {
        throw new Error(error.message);
      }

      console.log('Raw data from Supabase:', JSON.stringify(data, null, 2));

      // Retornar as especializações com código e nome
      const result = data?.map((item: any) => {
        // especializacoes pode ser um objeto ou array dependendo do Supabase
        const espec = Array.isArray(item.especializacoes) ? item.especializacoes[0] : item.especializacoes;
        
        return {
          codigo: espec?.codigo || item.codigo_especializacao,
          nome: espec?.nome || 'Especialização sem nome'
        };
      }).filter(spec => spec.codigo) || [];
      
      console.log('Processed specializations:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('Error fetching clinic specializations:', error);
      throw error;
    }
  }

  async addSpecializationToClinic(clinicId: number, specializationId: number) {
    try {
      const { error } = await supabase
        .from('clinicas_especializacoes')
        .insert({
          codigo_clinica: clinicId,
          codigo_especializacao: specializationId
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding specialization to clinic:', error);
      throw error;
    }
  }

  async removeSpecializationFromClinic(clinicId: number, specializationId: number) {
    try {
      const { error } = await supabase
        .from('clinicas_especializacoes')
        .delete()
        .eq('codigo_clinica', clinicId)
        .eq('codigo_especializacao', specializationId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing specialization from clinic:', error);
      throw error;
    }
  }
}

export const clinicService = new ClinicService();