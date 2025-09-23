import React from "react";

const NativeStackLibrary = require("@react-navigation/native-stack");
const createNativeStackNavigator = NativeStackLibrary.createNativeStackNavigator;

import LoginScreen from "../screens/LoginScreen";
import RegisterPatient from "../screens/RegisterPatient";
import RegisterClinic from "../screens/RegisterClinic";
import PatientMenu from "../screens/PatientMenu";
import ClinicMenu from "../screens/ClinicMenu";
import ClinicEditScreen from "../screens/ClinicEditScreen";
import ClinicList from "../screens/ClinicList";

export type RootStackParamList = {
  Login: undefined;
  RegisterPatient: undefined;
  RegisterClinic: undefined;
  PatientMenu: { patient: any } | undefined;
  ClinicMenu: { clinic: any } | undefined;
  ClinicEdit: { clinic: any } | undefined;
  ClinicList: undefined;
};

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterPatient" component={RegisterPatient} options={{ title: "Cadastrar Paciente" }} />
      <Stack.Screen name="RegisterClinic" component={RegisterClinic} options={{ title: "Cadastrar Clínica" }} />
      <Stack.Screen name="PatientMenu" component={PatientMenu} options={{ title: "Menu Paciente" }} />
      <Stack.Screen name="ClinicMenu" component={ClinicMenu} options={{ title: "Menu Clínica" }} />
      <Stack.Screen name="ClinicEdit" component={ClinicEditScreen} options={{ title: "Editar Clínica" }} />
      <Stack.Screen name="ClinicList" component={ClinicList} options={{ title: "Clínicas" }} />
    </Stack.Navigator>
  );
}
