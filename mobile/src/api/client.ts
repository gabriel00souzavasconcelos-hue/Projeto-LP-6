// src/api/client.ts
import axios from "axios";
import { Clinic, Patient, Specialization } from "../types";

export const BASE_URL = "http://192.168.2.233:4000"; // Backend na porta 4000

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// AUTH
export async function authLogin(email: string, senha: string, role: "paciente" | "clinica") {
  const res = await api.post("/auth/login", { email, senha, role });
  return res.data; // backend deve retornar o objeto do paciente ou clínica
}

export async function authRegister(role: "paciente" | "clinica", payload: any) {
  const res = await api.post("/auth/register", { role, payload });
  return res.data;
}

// PATIENTS
export async function createPatient(payload: Omit<Patient, "codigo">) {
  const res = await api.post("/patients", payload);
  return res.data;
}
export async function getPatient(id: number) {
  const res = await api.get(`/patients/${id}`);
  return res.data as Patient;
}

// CLINICS
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

// SPECIALIZATIONS
export async function getSpecializations() {
  const res = await api.get("/specializations");
  return res.data as Specialization[];
}

export default api;
