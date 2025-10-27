import React from "react";

const NativeStackLibrary = require("@react-navigation/native-stack");
const createNativeStackNavigator = NativeStackLibrary.createNativeStackNavigator;

import LoginScreen from "../screens/LoginScreen";
import RegisterPatient from "../screens/RegisterPatient";
import RegisterClinic from "../screens/RegisterClinic";
import PatientMenu from "../screens/PatientMenu";
import PatientEditScreen from "../screens/PatientEditScreen";
import ClinicMenu from "../screens/ClinicMenu";
import ClinicEditScreen from "../screens/ClinicEditScreen";
import ClinicList from "../screens/ClinicList";
import ClinicDetailsScreen from "../screens/ClinicDetailsScreen";
import SpecializationsScreen from "../screens/SpecializationsScreen";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";
import ClinicPatientsScreen from "../screens/ClinicPatientsScreen";
import ClinicAgendaScreen from "../screens/ClinicAgendaScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ClinicReportsScreen from "../screens/ClinicReportsScreen";
import PatientDocumentsScreen from "../screens/PatientDocumentsScreen";
import ClinicDocumentsScreen from "../screens/ClinicDocumentsScreen";

export type RootStackParamList = {
  Login: undefined;
  RegisterPatient: undefined;
  RegisterClinic: undefined;
  PatientMenu: { patient: any } | undefined;
  PatientEdit: { patient: any };
  ClinicMenu: { clinic: any } | undefined;
  ClinicEdit: { clinic: any } | undefined;
  ClinicList: { patient?: any };
  ClinicDetails: { clinicId: number; patient?: any };
  SpecializationsScreen: { clinicCode?: number };
  Appointments: { patient: any };
  BookAppointment: { clinic: any; patient: any };
  ClinicPatients: { clinic: any };
  ClinicAgenda: { clinic: any };
  Notifications: { patient: any };
  ClinicReports: { clinic: any };
  PatientDocuments: { patient: any };
  ClinicDocuments: { clinic: any };
};

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterPatient" component={RegisterPatient} options={{ title: "Cadastrar Paciente" }} />
      <Stack.Screen name="RegisterClinic" component={RegisterClinic} options={{ title: "Cadastrar Clínica" }} />
      <Stack.Screen name="PatientMenu" component={PatientMenu} options={{ title: "Menu Paciente" }} />
      <Stack.Screen name="PatientEdit" component={PatientEditScreen} options={{ title: "Editar Perfil" }} />
      <Stack.Screen name="ClinicMenu" component={ClinicMenu} options={{ title: "Menu Clínica" }} />
      <Stack.Screen name="ClinicEdit" component={ClinicEditScreen} options={{ title: "Editar Clínica" }} />
      <Stack.Screen name="ClinicList" component={ClinicList} options={{ title: "Clínicas" }} />
      <Stack.Screen name="ClinicDetails" component={ClinicDetailsScreen} options={{ title: "Detalhes da Clínica" }} />
      <Stack.Screen name="SpecializationsScreen" component={SpecializationsScreen} options={{ title: "Especializações" }} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} options={{ title: "Minhas Consultas" }} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ title: "Agendar Consulta" }} />
      <Stack.Screen name="ClinicPatients" component={ClinicPatientsScreen} options={{ title: "Pacientes e Consultas" }} />
      <Stack.Screen name="ClinicAgenda" component={ClinicAgendaScreen} options={{ title: "Agenda da Clínica" }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Notificações" }} />
      <Stack.Screen name="ClinicReports" component={ClinicReportsScreen} options={{ title: "Relatórios" }} />
      <Stack.Screen name="PatientDocuments" component={PatientDocumentsScreen} options={{ title: "Meus Documentos" }} />
      <Stack.Screen name="ClinicDocuments" component={ClinicDocumentsScreen} options={{ title: "Documentos dos Pacientes" }} />
    </Stack.Navigator>
  );
}