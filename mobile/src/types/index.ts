export type Patient = {
  codigo?: number;        // opcional no frontend (gerado pelo backend)
  nome: string;
  datan: string;          // formato YYYY-MM-DD
  fone: string;
  ende: string;
  email: string;
  senha?: string;         // opcional no frontend (ex.: ao listar não precisa)
};

export type Clinic = {
  codigo?: number;        // opcional no frontend (gerado pelo backend)
  nome: string;
  endereco: string;
  fone: string;
  email: string;
  senha?: string;         // opcional no frontend
  imagem?: string | null;
  especializacoes?: string[]; // array de nomes ou ids, conforme uso no frontend
};

export type Specialization = {
  codigo?: number; // opcional no frontend
  nome: string;
};

export type ClinicSpecialization = {
  codigo_clinica: number;
  codigo_especializacao: number;
};
