import React from "react";
import RootNavigator from "./src/navigation";

const NavigationLibrary = require("@react-navigation/native");
const NavigationContainer = NavigationLibrary.NavigationContainer;

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
