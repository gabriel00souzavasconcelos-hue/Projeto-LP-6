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
  codigo: number; 
  nome: string;
};

export type ClinicSpecialization = {
  codigo_clinica: number;
  codigo_especializacao: number;
};

export type AppointmentStatus = 'agendada' | 'confirmada' | 'cancelada' | 'concluida';

export type Appointment = {
  codigo?: number;
  codigo_paciente: number;
  codigo_clinica: number;
  codigo_especializacao: number;
  data_hora: string;
  status: AppointmentStatus;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
};

export type AppointmentWithDetails = Appointment & {
  paciente_nome?: string;
  paciente_email?: string;
  clinica_nome?: string;
  clinica_endereco?: string;
  especializacao_nome?: string;
  clinicas?: {
    nome: string;
    endereco?: string;
    fone?: string;
  };
  pacientes?: {
    nome: string;
    email?: string;
    fone?: string;
  };
  especializacoes?: {
    nome: string;
  };
};

export type DocumentType = 'exame' | 'receita' | 'laudo' | 'atestado' | 'pedido_exame' | 'resultado_exame' | 'outro';

export type Document = {
  codigo?: number;
  codigo_paciente: number;
  codigo_clinica?: number;
  nome_arquivo: string;
  url_arquivo: string;
  tipo_documento: DocumentType;
  descricao?: string;
  tamanho_arquivo?: number;
  enviado_por: 'paciente' | 'clinica';
  criado_em?: string;
};

export type DocumentWithDetails = Document & {
  paciente_nome?: string;
  clinica_nome?: string;
  clinicas?: {
    nome: string;
  };
};
