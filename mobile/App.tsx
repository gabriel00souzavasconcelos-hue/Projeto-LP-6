import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { ClinicProvider } from './src/contexts/ClinicContexts';

export default function App() {
  return (
    <ClinicProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ClinicProvider>
  );
}