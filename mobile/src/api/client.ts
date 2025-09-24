import axios from "axios";
import { Clinic, Patient, Specialization } from "../types";

export const BASE_URL = "http://192.168.100.36:4000"; 

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

export default api;
