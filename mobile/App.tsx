// App.tsx
import React from "react";
import RootNavigator from "./src/navigation";

// Importação simplificada temporária - pode ser que o NavigationContainer esteja 
// disponível mas não sendo reconhecido pelo TypeScript
const NavigationLibrary = require("@react-navigation/native");
const NavigationContainer = NavigationLibrary.NavigationContainer;

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
