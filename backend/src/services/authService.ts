import { supabase } from '../supabaseClient';

export interface LoginData {
  email: string;
  senha: string;
  role: 'paciente' | 'clinica';
}

export interface RegisterData {
  role: 'paciente' | 'clinica';
  payload: any;
}

export class AuthService {
  async login(loginData: LoginData) {
    const { email, senha, role } = loginData;

    if (!email || !senha || (role !== 'paciente' && role !== 'clinica')) {
      throw new Error('Dados de login inválidos');
    }

    const table = role === 'paciente' ? 'pacientes' : 'clinicas';
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .limit(1)
      .single();

    if (error) {
      throw new Error('Credenciais inválidas');
    }

    // Remove senha antes de retornar
    const safeUser = { ...data };
    delete (safeUser as any).senha;

    return safeUser;
  }

  async register(registerData: RegisterData) {
    const { role, payload } = registerData;

    if (!role || !payload) {
      throw new Error('Dados inválidos');
    }

    const table = role === 'paciente' ? 'pacientes' : 'clinicas';
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const safeUser = { ...data };
    delete (safeUser as any).senha;

    return safeUser;
  }
}

export const authService = new AuthService();