import { Clinic, Patient, Specialization, Appointment, AppointmentWithDetails, AppointmentStatus, Document, DocumentWithDetails } from "../types";
import axios from "axios";

export const BASE_URL = "http://192.168.100.198:4000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request.method?.toUpperCase(), request.url);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.log('Request failed:', error.config?.url, error.message);
    return Promise.reject(error);
  }
);

// Image upload utility
export async function uploadImage(imageUri: string) {
  const formData = new FormData();
  const filename = imageUri.split('/').pop() || 'image.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('image', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.imageUrl;
}

export async function authLogin(email: string, senha: string, role: "paciente" | "clinica") {
  const res = await api.post("/auth/login", { email, senha, role });
  return res.data; 
}

export async function authRegister(role: "paciente" | "clinica", payload: any) {
  const res = await api.post("/auth/register", { role, payload });
  return res.data;
}


export async function createPatient(payload: Omit<Patient, "codigo">) {
  const res = await api.post("/patients", payload);
  return res.data;
}
export async function getPatient(id: number) {
  const res = await api.get(`/patients/${id}`);
  return res.data as Patient;
}


export async function createClinic(payload: Omit<Clinic, "codigo">) {
  const res = await api.post("/clinics", payload);
  return res.data;
}
export async function getClinics(specialization?: string) {
  const params: any = {};
  if (specialization) params.specialization = specialization; 
  const res = await api.get("/clinics", { params });
  return res.data as Clinic[];
}
export async function getClinicById(id: number) {
  const res = await api.get(`/clinics/${id}`);
  return res.data as Clinic;
}
export async function updateClinic(id: number, payload: Partial<Clinic>) {
  const res = await api.put(`/clinics/${id}`, payload);
  return res.data;
}


export async function getSpecializations() {
  const res = await api.get("/specializations");
  return res.data as Specialization[];
}

export async function createSpecialization(nome: string) {
  const res = await api.post("/specializations", { nome });
  return res.data as Specialization;
}

export async function getClinicSpecializations(clinicCode: number) {
  const res = await api.get(`/clinics/${clinicCode}/specializations`);
  return res.data as Specialization[];
}

export async function addSpecializationToClinic(clinicCode: number, specializationName: string) {
  // First find the specialization by name
  const specializations = await getSpecializations();
  const specialization = specializations.find(s => s.nome === specializationName);
  if (!specialization) {
    throw new Error('Especialização não encontrada');
  }
  
  const res = await api.post(`/clinics/${clinicCode}/specializations`, { 
    codigo_especializacao: specialization.codigo 
  });
  return res.data;
}

// Função para buscar pacientes de uma clínica específica
export async function getClinicPatients(clinicCode: number) {
  const res = await api.get(`/appointments/clinic/${clinicCode}`);
  // Extrair pacientes únicos dos appointments
  const appointments = res.data as AppointmentWithDetails[];
  const uniquePatients = appointments.reduce((acc, appointment) => {
    if (!acc.find(p => p.codigo === appointment.codigo_paciente)) {
      acc.push({
        codigo: appointment.codigo_paciente,
        nome: appointment.paciente_nome || '',
        email: appointment.paciente_email || '',
        // Usar valores padrão para os campos obrigatórios que não estão disponíveis
        datan: '',
        fone: '',
        ende: '',
      } as Patient);
    }
    return acc;
  }, [] as Patient[]);
  return uniquePatients;
}

export async function removeSpecializationFromClinic(clinicCode: number, specializationName: string) {
  // First find the specialization by name
  const specializations = await getSpecializations();
  const specialization = specializations.find(s => s.nome === specializationName);
  if (!specialization) {
    throw new Error('Especialização não encontrada');
  }
  
  const res = await api.delete(`/clinics/${clinicCode}/specializations/${specialization.codigo}`);
  return res.data;
}

// ============ APPOINTMENTS API ============

export async function createAppointment(appointmentData: Omit<Appointment, 'codigo' | 'criado_em' | 'atualizado_em'>) {
  const res = await api.post("/appointments", appointmentData);
  return res.data as Appointment;
}

export async function getAppointmentById(codigo: number) {
  const res = await api.get(`/appointments/${codigo}`);
  return res.data as AppointmentWithDetails;
}

export async function getAppointmentsByPatient(codigo_paciente: number) {
  const res = await api.get(`/appointments/patient/${codigo_paciente}`);
  return res.data as AppointmentWithDetails[];
}

export async function getAppointmentsByClinic(codigo_clinica: number) {
  const res = await api.get(`/appointments/clinic/${codigo_clinica}`);
  return res.data as AppointmentWithDetails[];
}

export async function updateAppointmentStatus(codigo: number, status: AppointmentStatus) {
  const res = await api.patch(`/appointments/${codigo}/status`, { status });
  return res.data as Appointment;
}

export async function updateAppointment(codigo: number, updates: Partial<Omit<Appointment, 'codigo' | 'criado_em' | 'atualizado_em'>>) {
  const res = await api.put(`/appointments/${codigo}`, updates);
  return res.data as Appointment;
}

export async function deleteAppointment(codigo: number) {
  const res = await api.delete(`/appointments/${codigo}`);
  return res.data;
}

export async function getAvailableSlots(codigo_clinica: number, data: string) {
  const res = await api.get(`/appointments/slots/available`, {
    params: { codigo_clinica, data }
  });
  return res.data as string[];
}

// ============ DOCUMENTS API ============

export async function uploadDocument(fileUri: string, documentData: Omit<Document, 'codigo' | 'criado_em' | 'url_arquivo' | 'nome_arquivo' | 'tamanho_arquivo'>) {
  // First upload the file
  const imageUrl = await uploadImage(fileUri);
  
  // Get filename and size
  const filename = fileUri.split('/').pop() || 'document';
  
  // Create document record
  const res = await api.post("/documents", {
    ...documentData,
    url_arquivo: imageUrl,
    nome_arquivo: filename,
  });
  return res.data as Document;
}

export async function createDocument(documentData: Omit<Document, 'codigo' | 'criado_em'>) {
  const res = await api.post("/documents", documentData);
  return res.data as Document;
}

export async function getDocumentById(codigo: number) {
  const res = await api.get(`/documents/${codigo}`);
  return res.data as DocumentWithDetails;
}

export async function getDocumentsByPatient(codigo_paciente: number) {
  const res = await api.get(`/documents/patient/${codigo_paciente}`);
  return res.data as DocumentWithDetails[];
}

export async function getDocumentsByClinic(codigo_clinica: number) {
  const res = await api.get(`/documents/clinic/${codigo_clinica}`);
  return res.data as DocumentWithDetails[];
}

export async function getDocumentsByPatientAndClinic(codigo_paciente: number, codigo_clinica: number) {
  const res = await api.get(`/documents/patient/${codigo_paciente}/clinic/${codigo_clinica}`);
  return res.data as DocumentWithDetails[];
}

export async function deleteDocument(codigo: number) {
  const res = await api.delete(`/documents/${codigo}`);
  return res.data;
}

export async function updateDocument(codigo: number, updates: Partial<Omit<Document, 'codigo' | 'criado_em'>>) {
  const res = await api.put(`/documents/${codigo}`, updates);
  return res.data as Document;
}

export default api;
