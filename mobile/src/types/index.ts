export type Patient = {
  codigo?: number;        
  nome: string;
  datan: string;         
  fone: string;
  ende: string;
  email: string;
  senha?: string;        
};

export type Clinic = {
  codigo?: number;        
  nome: string;
  endereco: string;
  fone: string;
  email: string;
  senha?: string;         
  imagem?: string | null;
  especializacoes?: string[]; 
};

export type Specialization = {
  codigo?: number; 
  nome: string;
};

export type ClinicSpecialization = {
  codigo_clinica: number;
  codigo_especializacao: number;
};
