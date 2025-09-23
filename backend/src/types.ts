// backend/src/types.ts
/**
 * Tipos baseados no esquema SQL fornecido:
 * pacientes, clinicas, especializacoes, clinicas_especializacoes
 */

export interface Patient {
  codigo: number;        // SERIAL PRIMARY KEY
  nome: string;
  datan: string;         // armazenamos como string ISO (YYYY-MM-DD)
  fone: string;
  ende: string;
  email: string;
  senha: string;
}

export interface Clinic {
  codigo: number;        // SERIAL PRIMARY KEY
  nome: string;
  endereco: string;
  fone: string;
  email: string;
  senha: string;
  imagem?: string | null;
}

export interface Specialization {
  codigo: number;
  nome: string;
}

export interface ClinicSpecialization {
  codigo_clinica: number;
  codigo_especializacao: number;
}

/**
 * Database interface para uso com supabase-js createClient<Database>
 * Aqui estamos mapeando apenas as tabelas utilizadas.
 */
export interface Database {
  public: {
    Tables: {
      pacientes: {
        Row: Patient;
        Insert: Omit<Patient, 'codigo'>;
        Update: Partial<Omit<Patient, 'codigo'>>;
      };
      clinicas: {
        Row: Clinic;
        Insert: Omit<Clinic, 'codigo'>;
        Update: Partial<Omit<Clinic, 'codigo'>>;
      };
      especializacoes: {
        Row: Specialization;
        Insert: Omit<Specialization, 'codigo'>;
        Update: Partial<Omit<Specialization, 'codigo'>>;
      };
      clinicas_especializacoes: {
        Row: ClinicSpecialization;
        Insert: ClinicSpecialization;
        Update: Partial<ClinicSpecialization>;
      };
    };
    Functions: Record<string, unknown>;
    Views: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
}
